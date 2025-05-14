import { cosmiconfigSync } from 'cosmiconfig'
import { Logger } from './logger'

export interface Config {
  openApiFilesPath: string
  outputSchemasPath: string
}

const FILE_NAME = 'openapiMockGenerator'

/**
 * Loads the configuration for the OpenAPI mock generator from a configuration file.
 * The configuration file should be named 'openapiMockGenerator' and can be in various formats (e.g., JSON, YAML).
 * @returns {Config} - The configuration object containing the paths for OpenAPI files and output schemas.
 */
export function loadConfig(): Config {
  const explorer = cosmiconfigSync(FILE_NAME, {
    searchPlaces: [
      `${FILE_NAME}.json`,
      `${FILE_NAME}.yaml`,
      `${FILE_NAME}.yml`,
      `${FILE_NAME}.js`,
      `${FILE_NAME}.ts`,
      `${FILE_NAME}.config.json`,
      `${FILE_NAME}.config.yaml`,
      `${FILE_NAME}.config.yml`,
      `${FILE_NAME}.config.js`,
      `${FILE_NAME}.config.ts`
    ],
    stopDir: process.cwd()
  })
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
