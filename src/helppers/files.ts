import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { Logger } from '@/helppers/logger'

/**
 * Writes a JSON file to the specified path. If the directory does not exist, it creates it.
 * @param filePath - The path where the file will be written.
 * @param content - The content to write to the file.
 */
export function writeFile<T = string | Record<string, unknown>>(
  filePath: string,
  content: T
): void {
  const dir = dirname(filePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
}

/**
 * Recursively reads all files in a given folder and its subfolders.
 * @param folderPath The root folder to start searching for files.
 * @param fileExtension The file extension to filter by (e.g., ".yaml").
 * @returns An array of file paths matching the given extension.
 */
function readFilesRecursively(
  folderPath: string,
  fileExtension: string
): string[] {
  const files: string[] = []

  function readFolder(currentPath: string) {
    const entries = readdirSync(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = join(currentPath, entry.name)

      if (entry.isDirectory()) {
        readFolder(entryPath)
      } else if (entry.isFile() && entry.name.endsWith(fileExtension)) {
        Logger.success(`Adding OpenAPI file: ${entryPath}`)
        files.push(entryPath)
      }
    }
  }

  readFolder(folderPath)
  return files
}

/**
 * Reads all OpenAPI files in a given folder and its subfolders.
 * @param folderPath The root folder to start searching for OpenAPI files.
 * @returns An array of file paths to OpenAPI files.
 */
export function readOpenApiFiles(folderPath: string): string[] {
  Logger.info(`Searching for OpenAPI files in folder: ${folderPath}`)
  const openApiFiles = readFilesRecursively(folderPath, '.yaml')

  return openApiFiles
}
