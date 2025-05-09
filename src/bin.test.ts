import { init } from './bin'
import { loadConfig } from './helppers/config'
import { readOpenApiFiles, writeFile } from './helppers/files'
import { extractOpenApiSchemas } from './lib/open-api-reader'
import {
  generateSchemaMocksWithRelations,
  mergeSchemaArray
} from './lib/mock-generator'
import { Logger } from './helppers/logger'
import { OpenAPIV3 } from 'openapi-types'

jest.mock('./helppers/config')
jest.mock('./helppers/files')
jest.mock('./lib/open-api-reader')
jest.mock('./lib/mock-generator')
jest.mock('./helppers/logger')

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/'))
}))

describe('bin.ts', () => {
  describe('init', () => {
    it('should generate mock data and write to files', async () => {
      jest.mocked(loadConfig).mockReturnValue({
        openApiFilesPath: './api',
        outputSchemasPath: './mocks'
      })
      jest.mocked(readOpenApiFiles).mockResolvedValue(['file1.yaml'] as never)
      jest.mocked(extractOpenApiSchemas).mockResolvedValue({
        TestSchema: { type: 'object' }
      } as OpenAPIV3.SchemaObject)
      jest
        .mocked(mergeSchemaArray)
        .mockReturnValue({ TestSchema: { type: 'object' } })
      jest.mocked(generateSchemaMocksWithRelations).mockReturnValue({
        TestSchema: [{ id: '1', name: 'Test' }]
      })

      await init()

      expect(writeFile).toHaveBeenCalledWith('./mocks/TestSchema.json', [
        { id: '1', name: 'Test' }
      ])
    })

    it('should log an error if an exception occurs', async () => {
      jest.mocked(loadConfig).mockImplementation(() => {
        throw new Error('Config error')
      })

      await init()

      expect(Logger.error).toHaveBeenCalledWith(
        'Error creating mocks: ',
        expect.any(Error)
      )
    })
  })
})
