import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { activateDesktop, type BootstrapData } from "../lib/api";
import { setStoredToken } from "../lib/store";

interface SignInPageProps {
  onActivated: (data: BootstrapData) => void;
}

export function SignInPage({ onActivated }: SignInPageProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      // Only allow digits
      const digit = value.replace(/\D/g, "").slice(-1);
      setDigits((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });
      setError(null);

      // Auto-focus next input
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...pasted.split(""), ...Array(6).fill("")].slice(0, 6);
      setDigits(newDigits);
      // Focus the input after last pasted digit
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (code.length !== 6) return;

      setLoading(true);
      setError(null);

      try {
        const data = await activateDesktop(code);
        // Store the MCP token
        await setStoredToken(data.mcp_token);
        onActivated(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to connect. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [code, onActivated]
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center w-full max-w-sm"
      >
        {/* Header */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
          <span className="text-3xl">🐕</span>
        </div>
        <h1 className="text-white text-lg font-bold">Teach Charlie</h1>
        <p className="text-gray-400 text-sm mt-1 mb-6 text-center">
          Enter the 6-digit code from your dashboard
        </p>

        {/* 6-digit code input */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
                className="w-11 h-14 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-xl font-bold focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg w-full"
          >
            <p className="text-red-400 text-xs text-center">{error}</p>
          </motion.div>
        )}

        {/* Help link */}
        <p className="text-gray-600 text-xs mt-6 text-center">
          Don't have a code?{" "}
          <a
            href="https://app.teachcharlie.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Get one at app.teachcharlie.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
