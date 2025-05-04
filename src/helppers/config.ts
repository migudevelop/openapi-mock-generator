import { cosmiconfigSync } from 'cosmiconfig'

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
    throw new Error('Configuration file not found or is empty')
  }
  return result.config as Config
}
