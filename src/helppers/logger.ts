import {
  blueBright,
  cyanBright,
  greenBright,
  yellowBright,
  redBright
} from 'colorette'

/**
 * Returns the current timestamp formatted as a string.
 */
function getCurrentTimestamp(): string {
  const now = new Date()
  return now.toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium'
  })
}

/**
 * A utility class for logging messages with different levels of severity.
 * Each log message is prefixed with a timestamp and a color-coded label.
 */
export class Logger {
  static info<T = string>(...message: T[]): void {
    this.mainLog(`${blueBright('[INFO]')} ${cyanBright(String(message))}`)
  }

  static success<T = string>(...message: T[]): void {
    this.mainLog(`${greenBright('[SUCCESS]')} ${greenBright(String(message))}`)
  }

  static warn<T = string>(...message: T[]): void {
    this.mainLog(`${yellowBright('[WARN]')} ${yellowBright(String(message))}`)
  }

  static error<T = string>(...message: T[]): void {
    this.mainLog(`${redBright('[ERROR]')} ${redBright(String(message))}`)
  }

  private static mainLog<T = string>(...message: T[]): void {
    console.log(
      `${cyanBright(`[${getCurrentTimestamp()}]`)} ${message.join(' ')}`
    )
  }
}
