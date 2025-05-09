import {
  generateSchemaMocksWithRelations,
  mergeSchemaArray,
  applyRelations
} from './mock-generator'
import { OpenAPIV3 } from 'openapi-types'

describe('mock-generator', () => {
  describe('generateSchemaMocksWithRelations', () => {
    it('should generate mock data for schemas', () => {
      const schemas: Record<string, OpenAPIV3.SchemaObject> = {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }

      const result = generateSchemaMocksWithRelations(schemas, 2)

      expect(result.User).toHaveLength(2)
    })

    it('should generate 10 mock data for schemas', () => {
      const schemas: Record<string, OpenAPIV3.SchemaObject> = {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }

      const result = generateSchemaMocksWithRelations(schemas)

      expect(result.User).toHaveLength(10)
    })

    it('should handle empty schemas gracefully', () => {
      const schemas: Record<string, OpenAPIV3.SchemaObject> = {}

      const result = generateSchemaMocksWithRelations(schemas, 2)

      expect(result).toEqual({})
    })
  })

  describe('mergeSchemaArray', () => {
    it('should merge an array of schema objects', () => {
      const schemaArray: OpenAPIV3.SchemaObject[] = [
        { properties: { id: { type: 'string' } } },
        { properties: { name: { type: 'string' } } }
      ]

      const result = mergeSchemaArray(schemaArray)

      expect(result).toHaveProperty('properties.id')
      expect(result).toHaveProperty('properties.name')
    })
  })

  describe('applyRelations', () => {
    it('should apply relations between mock data based on schema definitions', () => {
      const mock = { userId: '123' }
      const schemas: Record<string, OpenAPIV3.SchemaObject> = {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
      const cache = {
        User: [{ id: '456', name: 'John Doe' }]
      }

      const result = applyRelations(mock, schemas, cache)

      expect(result.userId).toBe('456')
    })

    it('should not modify unrelated keys', () => {
      const mock = { unrelatedKey: 'value' }
      const schemas: Record<string, OpenAPIV3.SchemaObject> = {}
      const cache = {}

      const result = applyRelations(mock, schemas, cache)

      expect(result.unrelatedKey).toBe('value')
    })
  })
})
