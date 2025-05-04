#!/usr/bin/env node
import { OpenAPIV3 } from 'openapi-types'
import { readOpenApiFiles, writeFile } from './helppers/files'
import { extractOpenApiSchemas } from './lib/open-api-reader'
import {
  generateSchemaMocksWithRelations,
  mergeSchemaArray
} from './lib/mock-generator'
import { Logger } from './helppers/logger'

export async function init() {
  try {
    const files = await readOpenApiFiles('./src/openapi')
    const schemas = await Promise.all(
      files.map(async (filePath) => await extractOpenApiSchemas(filePath))
    )
    const mergedSchemas = mergeSchemaArray(schemas as OpenAPIV3.SchemaObject[])
    const generateMockDatas = generateSchemaMocksWithRelations(mergedSchemas, 2)
    for (const [name, mockData] of Object.entries(generateMockDatas)) {
      writeFile(`./src/mocks/schemas/${name}.json`, mockData)
    }
  } catch (error) {
    Logger.error('Error creating mocks: ', error)
  }
}

init()
