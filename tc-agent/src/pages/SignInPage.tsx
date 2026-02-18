import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export function SignInPage() {
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
        <h1 className="text-white text-lg font-bold">Welcome to Teach Charlie</h1>
        <p className="text-gray-400 text-sm mt-1 mb-6 text-center">
          Sign in to connect your AI agent
        </p>

        {/* Clerk SignIn component */}
        <div className="w-full">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-gray-900 border border-gray-800 shadow-none",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton:
                  "bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                formFieldLabel: "text-gray-300",
                formFieldInput:
                  "bg-gray-800 border-gray-700 text-white focus:border-purple-500",
                formButtonPrimary:
                  "bg-purple-600 hover:bg-purple-700 text-white",
                footerActionLink: "text-purple-400 hover:text-purple-300",
                identityPreview: "bg-gray-800 border-gray-700",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-purple-400",
              },
            }}
            routing="hash"
          />
        </div>
      </motion.div>
    </div>
  );
}
