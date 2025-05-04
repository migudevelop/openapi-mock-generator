import chalk from 'chalk'

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
  /**
   * Logs an informational message.
   * @template T - The type of the message(s) to log. Defaults to `string`.
   * @param {...T[]} message - The message(s) to log.
   */
  static info<T = string>(...message: T[]): void {
    this.mainLog(`${chalk.blueBright('[INFO]')} ${chalk.cyanBright(message)}`)
  }

  /**
   * Logs a success message.
   * @template T - The type of the message(s) to log. Defaults to `string`.
   * @param {...T[]} message - The message(s) to log.
   */
  static success<T = string>(...message: T[]): void {
    this.mainLog(
      `${chalk.greenBright('[SUCCESS]')} ${chalk.greenBright(message)}`
    )
  }

  /**
   * Logs a warning message.
   * @template T - The type of the message(s) to log. Defaults to `string`.
   * @param {...T[]} message - The message(s) to log.
   */
  static warn<T = string>(...message: T[]): void {
    this.mainLog(
      `${chalk.yellowBright('[WARN]')} ${chalk.yellowBright(message)}`
    )
  }

  /**
   * Logs an error message.
   * @template T - The type of the message(s) to log. Defaults to `string`.
   * @param {...T[]} message - The message(s) to log.
   */
  static error<T = string>(...message: T[]): void {
    this.mainLog(`${chalk.redBright('[ERROR]')} ${chalk.redBright(message)}`)
  }

  /**
   * Logs a message with a timestamp. This is a private method used internally by the other logging methods.
   * @template T - The type of the message(s) to log. Defaults to `string`.
   * @param {...T[]} message - The message(s) to log.
   * @private
   */
  private static mainLog<T = string>(...message: T[]): void {
    console.log(`${chalk.cyanBright(`[${getCurrentTimestamp()}]`)}${message}`)
  }
}
