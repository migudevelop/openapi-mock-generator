import { Logger } from '@/helppers/logger'
import SwaggerParser from '@apidevtools/swagger-parser'
import { OpenAPIV3 } from 'openapi-types'
import { isNullish } from '@migudevelop/types-utils'

/**
 * Parses an OpenAPI document from the given file path.
 * @param {string} filePath - The path to the OpenAPI document file.
 * @returns {Promise<OpenAPIV3.Document>} The parsed OpenAPI document.
 * @throws Will throw an error if the document cannot be parsed.
 */
export async function parseOpenApiDocument(filePath: string) {
  try {
    const api = (await SwaggerParser.parse(filePath)) as OpenAPIV3.Document
    return api
  } catch (error) {
    console.error('Error parsing OpenAPI document:', error)
    throw error
  }
}

/**
 * Checks if a response object contains a schema in the 'application/json' content type.
 * @param {OpenAPIV3.ResponseObject} response - The OpenAPI response object.
 * @returns {boolean} True if the response contains a schema, false otherwise.
 */
export function containsSchema(response: OpenAPIV3.ResponseObject) {
  return !!response?.content?.['application/json']?.schema
}

/**
 * Checks if an OpenAPI document contains component schemas.
 * @param {OpenAPIV3.Document} response - The OpenAPI document.
 * @returns {boolean} True if the document does not contain component schemas, false otherwise.
 */
export function containsComponentSchemas(response: OpenAPIV3.Document) {
  return isNullish(response?.components?.schemas)
}

/**
 * Retrieves the schema from a response object in the 'application/json' content type.
 * @template T - The type of the OpenAPI response object.
 * @param {T} response - The OpenAPI response object.
 * @returns {OpenAPIV3.SchemaObject | undefined} The schema object, or undefined if not found.
 */
export function getOpenApiSchema<T extends OpenAPIV3.ResponseObject>(
  response: T
) {
  return response?.content?.['application/json'].schema
}

/**
 * Extracts schemas from the responses of an OpenAPI operation.
 * @template T - The type of the OpenAPI responses object.
 * @param {T} responses - The OpenAPI responses object.
 * @param {string} method - The HTTP method of the operation.
 * @param {string} path - The path of the operation.
 * @returns {OpenAPIV3.SchemaObject[]} An array of schema objects found in the responses.
 */
export function getOpenApiSchemasByResponses<
  T extends OpenAPIV3.ResponsesObject
>(responses: T, method: string, path: string) {
  const schemas: OpenAPIV3.SchemaObject[] = []
  for (const statusCode in responses) {
    const response = responses[statusCode] as OpenAPIV3.ResponseObject

    if (containsSchema(response)) {
      const schema = getOpenApiSchema(response)
      schemas.push(schema as OpenAPIV3.SchemaObject)
      Logger.success(
        `Found schema for ${method.toUpperCase()} with ${statusCode} code in ${path}`
      )
    } else {
      Logger.warn(
        `No schema found for ${method.toUpperCase()} with ${statusCode} code in ${path}`
      )
    }
  }
  return schemas
}

/**
 * Extracts component schemas from an OpenAPI document file.
 * @param {string} filePath - The path to the OpenAPI document file.
 * @returns {Promise<OpenAPIV3.SchemaObject | undefined>} The extracted schemas, or undefined if not found.
 * @throws Will throw an error if the document cannot be parsed.
 */
export async function extractOpenApiSchemas(filePath: string) {
  try {
    const api = await parseOpenApiDocument(filePath)
    if (!containsComponentSchemas(api) && !isNullish(api?.components)) {
      Logger.info('Extracting schemas from components...')
      return api.components.schemas as OpenAPIV3.SchemaObject
    } else {
      Logger.warn('No schemas found in components.')
    }
  } catch (error) {
    Logger.error('Error parsing OpenAPI document:', error)
    throw error
  }
}
