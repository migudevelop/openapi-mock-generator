import { cosmiconfigSync } from 'cosmiconfig'
import { Logger } from './logger'

export interface Config {
  openApiFilesPath: string
  outputSchemasPath: string
}

/**
 * Loads the configuration for the OpenAPI mock generator from a configuration file.
 * The configuration file should be named 'openapiMockGenerator' and can be in various formats (e.g., JSON, YAML).
 * @returns {Config} - The configuration object containing the paths for OpenAPI files and output schemas.
 */
export function loadConfig(): Config {
  const explorer = cosmiconfigSync('openapiMockGenerator')
  const result = explorer.search()
  if (!result || result.isEmpty) {
    Logger.warn('No configuration file found. Using default values.')
    return {
      openApiFilesPath: './openapi',
      outputSchemasPath: './mocks/schemas'
    } as Config
  }
  return result.config as Config
}
