import { Logger } from './logger'

jest.mock('chalk', () => ({
  blueBright: jest.fn((msg) => msg),
  cyanBright: jest.fn((msg) => msg),
  greenBright: jest.fn((msg) => msg),
  yellowBright: jest.fn((msg) => msg),
  redBright: jest.fn((msg) => msg)
}))

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('info', () => {
    it('should log an informational message', () => {
      Logger.info('Test info message')
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/Test info message/)
      )
    })

    it('should handle empty messages', () => {
      Logger.info('')
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]')
      )
    })
  })

  describe('success', () => {
    it('should log a success message', () => {
      Logger.success('Test success message')
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/Test success message/)
      )
    })

    it('should handle empty messages', () => {
      Logger.success('')
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[SUCCESS]')
      )
    })
  })

  describe('warn', () => {
    it('should log a warning message', () => {
      Logger.warn('Test warning message')
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/Test warning message/)
      )
    })

    it('should handle empty messages', () => {
      Logger.warn('')
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]')
      )
    })
  })

  describe('error', () => {
    it('should log an error message', () => {
      Logger.error('Test error message')
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/Test error message/)
      )
    })

    it('should handle empty messages', () => {
      Logger.error('')
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]')
      )
    })
  })
})
