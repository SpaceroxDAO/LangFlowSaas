/**
 * OS detection and OpenClaw config path helpers.
 */

export type DetectedOS = 'mac' | 'windows' | 'linux' | 'unknown'

export function detectOS(): DetectedOS {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('mac')) return 'mac'
  if (ua.includes('win')) return 'windows'
  if (ua.includes('linux')) return 'linux'
  return 'unknown'
}

export function getOpenClawConfigPath(os: DetectedOS): string {
  switch (os) {
    case 'windows':
      return '%USERPROFILE%\\.openclaw\\openclaw.json'
    default:
      return '~/.openclaw/openclaw.json'
  }
}

export function getOpenClawConfigDir(os: DetectedOS): string {
  switch (os) {
    case 'windows':
      return '%USERPROFILE%\\.openclaw\\'
    default:
      return '~/.openclaw/'
  }
}

export function getFinderHint(os: DetectedOS): string {
  switch (os) {
    case 'mac':
      return 'Open Finder \u2192 Cmd+Shift+G \u2192 paste the path'
    case 'windows':
      return 'Open File Explorer \u2192 paste the path in the address bar'
    case 'linux':
      return 'Open your file manager or use: cp openclaw.json ~/.openclaw/'
    default:
      return 'Navigate to the .openclaw folder in your home directory'
  }
}
