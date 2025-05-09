import { loadConfig } from './config'
import { cosmiconfigSync, PublicExplorerSync } from 'cosmiconfig'
import { Logger } from './logger'

jest.mock('cosmiconfig')
jest.mock('./logger')

describe('config.ts', () => {
  describe('loadConfig', () => {
    it('should load configuration from a file', () => {
      const mockConfig = {
        openApiFilesPath: './api',
        outputSchemasPath: './mocks'
      }
      jest.mocked(cosmiconfigSync).mockReturnValue({
        search: () => ({ config: mockConfig, filepath: './mock-config-file' })
      } as PublicExplorerSync)

      const config = loadConfig()
      expect(config).toEqual(mockConfig)
    })

    it('should return default values if no configuration file is found', () => {
      jest
        .mocked(cosmiconfigSync)
        .mockReturnValue({ search: () => null } as PublicExplorerSync)

      const config = loadConfig()
      expect(config).toEqual({
        openApiFilesPath: './openapi',
        outputSchemasPath: './mocks/schemas'
      })
      expect(Logger.warn).toHaveBeenCalledWith(
        'No configuration file found. Using default values.'
      )
    })
  })
})
