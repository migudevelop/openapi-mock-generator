import { JSONSchemaFaker } from 'json-schema-faker'
import { OpenAPIV3 } from 'openapi-types'
import { faker } from '@faker-js/faker'
import { isString } from '@migudevelop/types-utils'

JSONSchemaFaker.extend('faker', () => faker)

type MockCache = Record<string, any[]>

/**
 * Generates mock data for all schemas in the OpenAPI document.
 * @param schemas - The schemas to generate mocks for.
 * @param count - The number of mock objects to generate for each schema.
 * @returns A cache of mock data for each schema.
 */
export function generateSchemaMocksWithRelations(
  schemas: Record<string, OpenAPIV3.SchemaObject>,
  count = 10
): MockCache {
  const cache: MockCache = {}

  // Generate mocks for each schema
  for (const [name, schema] of Object.entries(schemas)) {
    cache[name] = Array.from({ length: count }, () =>
      JSONSchemaFaker.generate(schema)
    )
  }

  // Apply relations between schemas
  for (const [name, mocks] of Object.entries(cache)) {
    cache[name] = mocks.map((mock) => applyRelations(mock, schemas, cache))
  }

  return cache
}

/**
 * Applies relations between mock data based on schema definitions.
 * @param mock - The mock object to process.
 * @param schemas - The schemas used to generate the mocks.
 * @param cache - The cache of generated mock data.
 * @returns The mock object with relations applied.
 */
function applyRelations<T extends Record<string, unknown>>(
  mock: T,
  schemas: Record<string, OpenAPIV3.SchemaObject>,
  cache: MockCache
): T {
  for (const [key, value] of Object.entries(mock)) {
    if (
      isString(value) &&
      key.toLocaleLowerCase() != 'id' &&
      key.toLocaleLowerCase().endsWith('id')
    ) {
      const relatedName = key
        .toLocaleLowerCase()
        .trim()
        .replace('id', '')
        .replace(/[^a-zA-Z0-9 ]/g, '')

      const targetSchema = Object.keys(schemas).find(
        (schema) => schema.toLowerCase() === relatedName.toLowerCase()
      )

      if (targetSchema && cache[targetSchema]) {
        mock[key as keyof T] =
          cache[targetSchema][
            Math.floor(Math.random() * cache[targetSchema].length)
          ].id
      }
    }
  }
  return mock
}

/**
 * Merges an array of schema objects into a single schema object.
 * @param schemaArray - The array of schema objects to merge.
 * @returns A merged schema object containing all properties from the input array.
 */
export function mergeSchemaArray(schemaArray: OpenAPIV3.SchemaObject[]) {
  const merged: Record<string, OpenAPIV3.SchemaObject> = {}

  for (const schemaObject of schemaArray) {
    for (const [key, value] of Object.entries(schemaObject)) {
      merged[key] = value
    }
  }

  return merged
}
