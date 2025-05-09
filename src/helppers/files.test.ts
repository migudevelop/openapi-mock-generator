import { writeFile, readOpenApiFiles } from './files'
import { existsSync, mkdirSync, writeFileSync, readdirSync, Dirent } from 'fs'
import { Logger } from '@/helppers/logger'
import { join } from 'path'

jest.mock('fs')
jest.mock('@/helppers/logger')

describe('files.ts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('writeFile', () => {
    it('should write a file and create directories if needed', () => {
      jest.mocked(existsSync).mockReturnValue(false)
      jest.mocked(mkdirSync).mockImplementation(jest.fn())
      jest.mocked(writeFileSync).mockImplementation(jest.fn())

      writeFile('mock/path/file.json', { key: 'value' })

      expect(mkdirSync).toHaveBeenCalledWith('mock/path', { recursive: true })
      expect(writeFileSync).toHaveBeenCalledWith(
        'mock/path/file.json',
        JSON.stringify({ key: 'value' }, null, 2),
        'utf-8'
      )
    })
  })

  describe('readOpenApiFiles', () => {
    it('should read all OpenAPI files in a folder', () => {
      jest
        .mocked(readdirSync)
        .mockReturnValueOnce([
          { name: 'file1.yaml', isFile: () => true, isDirectory: () => false },
          { name: 'subfolder', isFile: () => false, isDirectory: () => true }
        ] as Dirent[])
        .mockReturnValueOnce([
          { name: 'file2.yaml', isFile: () => true, isDirectory: () => false }
        ] as Dirent[])

      const result = readOpenApiFiles('mock/folder')

      expect(Logger.info).toHaveBeenCalledWith(
        'Searching for OpenAPI files in folder: mock/folder'
      )
      expect(result).toEqual([
        join('mock', 'folder', 'file1.yaml'),
        join('mock', 'folder', 'subfolder', 'file2.yaml')
      ])
    })
  })
})
