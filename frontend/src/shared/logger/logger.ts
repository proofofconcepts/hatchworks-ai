type Level = 'debug' | 'info' | 'warn' | 'error'

const COLORS: Record<Level, string> = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
}

const RESET = '\x1b[0m'

export function log(level: Level, message: string, context?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()

  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify({ level, message, timestamp, ...context }))
  } else {
    const prefix = `${COLORS[level]}[${level.toUpperCase()}]${RESET}`
    if (context) {
      console.log(`${prefix} ${message}`, context)
    } else {
      console.log(`${prefix} ${message}`)
    }
  }
}
