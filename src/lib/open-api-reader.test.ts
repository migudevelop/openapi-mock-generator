import * as Reader from './open-api-reader'

import { Logger } from '../helppers/logger'
import { OpenAPIV3 } from 'openapi-types'
import SwaggerParser from '@apidevtools/swagger-parser'
jest.mock('@apidevtools/swagger-parser')

const {
  parseOpenApiDocument,
  containsSchema,
  containsComponentSchemas,
  getOpenApiSchema,
  getOpenApiSchemasByResponses,
  extractOpenApiSchemas
} = Reader

jest.mock('../helppers/logger', () => ({
  Logger: {
    success: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}))

describe('open-api-reader', () => {
  const console = global.console

  beforeEach(() => {
    global.console = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn()
    } as unknown as Console
    jest.clearAllMocks()
  })

  afterEach(() => {
    global.console = console
  })

  describe('containsSchema', () => {
    it('should return true if response contains a schema', () => {
      const response: OpenAPIV3.ResponseObject = {
        description: 'A response',
        content: {
          'application/json': { schema: {} }
        }
      }
      expect(containsSchema(response)).toBe(true)
    })

    it('should return false if response does not contain a schema', () => {
      const response: OpenAPIV3.ResponseObject = { description: 'A response' }
      expect(containsSchema(response)).toBe(false)
    })

    it('should return false if response is undefined', () => {
      // @ts-expect-error Ignoring the type error for testing purposes
      expect(containsSchema(undefined)).toBe(false)
    })
  })

  describe('containsComponentSchemas', () => {
    it('should return true if document does not contain component schemas', () => {
      const document: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {}
      }
      expect(containsComponentSchemas(document)).toBe(true)
    })

    it('should return false if document contains component schemas', () => {
      const document: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: { schemas: {} }
      }
      expect(containsComponentSchemas(document)).toBe(false)
    })

    it('should return true if the document does not contain component schemas', () => {
      const document: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {}
      }

      expect(containsComponentSchemas(document)).toBe(true)
    })

    it('should return false if the document contains component schemas', () => {
      const document: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: { schemas: { TestSchema: { type: 'object' } } }
      }

      expect(containsComponentSchemas(document)).toBe(false)
    })

    it('should return true if the document is undefined', () => {
      //@ts-expect-error Ignoring the type error for testing purposes
      expect(containsComponentSchemas(undefined)).toBe(true)
    })
  })

  describe('getOpenApiSchema', () => {
    it('should return the schema from a response object', () => {
      const response: OpenAPIV3.ResponseObject = {
        description: 'A response',
        content: {
          'application/json': { schema: { type: 'object' } }
        }
      }
      expect(getOpenApiSchema(response)).toEqual({ type: 'object' })
    })

    it('should return undefined if no schema is found', () => {
      const response: OpenAPIV3.ResponseObject = { description: 'A response' }
      expect(getOpenApiSchema(response)).toBeUndefined()
    })

    it('should return the schema from a response object', () => {
      const response: OpenAPIV3.ResponseObject = {
        description: 'A response',
        content: {
          'application/json': {
            schema: { type: 'object', properties: { id: { type: 'string' } } }
          }
        }
      }

      expect(getOpenApiSchema(response)).toEqual({
        type: 'object',
        properties: { id: { type: 'string' } }
      })
    })

    it('should return undefined if no schema is found in the response object', () => {
      const response: OpenAPIV3.ResponseObject = {
        description: 'A response'
      }

      expect(getOpenApiSchema(response)).toBeUndefined()
    })

    it('should return undefined if no schema is found in the object', () => {
      expect(getOpenApiSchema({} as OpenAPIV3.ResponseObject)).toBeUndefined()
    })

    it('should return undefined if provided undefined', () => {
      expect(
        // @ts-expect-error Ignoring the type error for testing purposes
        getOpenApiSchema(undefined)
      ).toBeUndefined()
    })
  })

  describe('getOpenApiSchemasByResponses', () => {
    it('should extract schemas from responses', () => {
      const responses: OpenAPIV3.ResponsesObject = {
        200: {
          description: 'Success',
          content: {
            'application/json': { schema: { type: 'object' } }
          }
        }
      }

      const schemas = getOpenApiSchemasByResponses(responses, 'get', '/test')
      expect(schemas).toEqual([{ type: 'object' }])
      expect(Logger.success).toHaveBeenCalledWith(
        'Found schema for GET with 200 code in /test'
      )
    })

    it('should log a warning if no schema is found', () => {
      const responses: OpenAPIV3.ResponsesObject = {
        404: { description: 'Not Found' }
      }

      const schemas = getOpenApiSchemasByResponses(responses, 'get', '/test')
      expect(schemas).toEqual([])
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schema found for GET with 404 code in /test'
      )
    })

    it('should return an empty array if responses object is empty', () => {
      const responses = {}

      const schemas = getOpenApiSchemasByResponses(responses, 'get', '/empty')

      expect(schemas).toEqual([])
    })

    it('should log a warning if responses do not contain schemas', () => {
      const responses = {
        '200': {
          description: 'Success',
          content: {
            'application/json': {}
          }
        }
      }

      const schemas = getOpenApiSchemasByResponses(
        responses,
        'get',
        '/no-schema'
      )

      expect(schemas).toEqual([])
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schema found for GET with 200 code in /no-schema'
      )
    })

    it('should log success when schemas are found', () => {
      const responses = {
        '200': {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { id: { type: 'string' } } }
            }
          }
        }
      }

      //@ts-expect-error Ignoring the type error for testing purposes
      const schemas = getOpenApiSchemasByResponses(responses, 'get', '/users')

      expect(schemas).toHaveLength(1)
      expect(Logger.success).toHaveBeenCalledWith(
        'Found schema for GET with 200 code in /users'
      )
    })

    it('should log warnings when no schemas are found', () => {
      const responses = {
        '404': {
          content: {
            'application/json': {}
          }
        }
      }

      //@ts-expect-error Ignoring the type error for testing purposes
      const schemas = getOpenApiSchemasByResponses(responses, 'get', '/users')

      expect(schemas).toHaveLength(0)
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schema found for GET with 404 code in /users'
      )
    })
  })

  describe('extractOpenApiSchemas', () => {
    it('should extract schemas from components', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: { schemas: { TestSchema: { type: 'object' } } }
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await Reader.extractOpenApiSchemas('mockFilePath')
      expect(schemas).toEqual({ TestSchema: { type: 'object' } })
      expect(Logger.info).toHaveBeenCalledWith(
        'Extracting schemas from components...'
      )
    })

    it('should log a warning if no schemas are found', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {}
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await Reader.extractOpenApiSchemas('mockFilePath')
      expect(schemas).toBeUndefined()
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schemas found in components.'
      )
    })

    it('should log a warning if no schemas are found in components', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {}
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await extractOpenApiSchemas('mockFilePath')
      expect(schemas).toBeUndefined()
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schemas found in components.'
      )
    })

    it('should log an error and rethrow it if parsing the OpenAPI document fails', async () => {
      const mockError = new Error('Parsing failed')

      jest.mocked(SwaggerParser.parse).mockRejectedValue(mockError)

      await expect(extractOpenApiSchemas('invalidFilePath')).rejects.toThrow(
        'Parsing failed'
      )
      expect(Logger.error).toHaveBeenCalledWith(
        'Error parsing OpenAPI document:',
        mockError
      )
    })

    it('should log info when extracting schemas from components', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: { schemas: { TestSchema: { type: 'object' } } }
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await extractOpenApiSchemas('mockFilePath')
      expect(schemas).toEqual({ TestSchema: { type: 'object' } })
      expect(Logger.info).toHaveBeenCalledWith(
        'Extracting schemas from components...'
      )
    })

    it('should log info when schemas are successfully extracted', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: { schemas: { TestSchema: { type: 'object' } } }
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await extractOpenApiSchemas('mockFilePath')
      expect(schemas).toEqual({ TestSchema: { type: 'object' } })
      expect(Logger.info).toHaveBeenCalledWith(
        'Extracting schemas from components...'
      )
    })

    it('should return undefined and log a warning if the document does not contain component schemas', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {}
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await extractOpenApiSchemas('mockFilePath')
      expect(schemas).toBeUndefined()
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schemas found in components.'
      )
    })

    it('should return undefined and log a warning if components are null or undefined', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        // @ts-expect-error Ignoring the type error for testing purposes
        components: null
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await extractOpenApiSchemas('mockFilePath')
      expect(schemas).toBeUndefined()
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schemas found in components.'
      )
    })

    it('should extract schemas when components contain schemas', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: { schemas: { TestSchema: { type: 'object' } } }
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await extractOpenApiSchemas('mockFilePath')
      expect(schemas).toEqual({ TestSchema: { type: 'object' } })
      expect(Logger.info).toHaveBeenCalledWith(
        'Extracting schemas from components...'
      )
    })

    it('should log a warning if components do not contain schemas', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {}
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await extractOpenApiSchemas('mockFilePath')
      expect(schemas).toBeUndefined()
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schemas found in components.'
      )
    })

    it('should log a warning if components are null or undefined', async () => {
      const mockDocument: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        // @ts-expect-error Ignoring the type error for testing purposes
        components: null
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const schemas = await extractOpenApiSchemas('mockFilePath')
      expect(schemas).toBeUndefined()
      expect(Logger.warn).toHaveBeenCalledWith(
        'No schemas found in components.'
      )
    })

    it('should log an error and rethrow it if parsing the OpenAPI document fails', async () => {
      const mockError = new Error('Parsing failed')

      jest.mocked(SwaggerParser.parse).mockRejectedValue(mockError)

      await expect(extractOpenApiSchemas('invalidFilePath')).rejects.toThrow(
        'Parsing failed'
      )
      expect(Logger.error).toHaveBeenCalledWith(
        'Error parsing OpenAPI document:',
        mockError
      )
    })
  })

  describe('parseOpenApiDocument', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should parse a valid OpenAPI document', async () => {
      const mockDocument = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {}
      }

      jest.mocked(SwaggerParser.parse).mockResolvedValue(mockDocument)

      const result = await parseOpenApiDocument('mockFilePath')
      expect(result).toEqual(mockDocument)
    })

    it('should throw an error for an invalid document', async () => {
      jest
        .mocked(SwaggerParser.parse)
        .mockRejectedValue(new Error('Invalid document'))

      await expect(parseOpenApiDocument('invalidFilePath')).rejects.toThrow(
        'Invalid document'
      )
    })
  })
})
