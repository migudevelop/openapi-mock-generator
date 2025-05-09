/**
 * Converts a string to KebabCase.
 * @param str - The string to convert to KebabCase.
 * @returns The KebabCase version of the input string.
 */
export function toKebabCase(str: string): string {
  return (
    str
      // Step 1: Remove special characters like [], :, /, {, }, etc.
      .replace(/[\/\{\}\[\]:]/g, ' ')
      .trim() // Removes '/', '{', '}', '[', ']', ':' characters.
      // Step 2: Replace uppercase letters with lowercase and add a hyphen before them
      .replace(/([a-z])([A-Z])/g, '$1-$2') // Adds a hyphen between lowercase and uppercase letters.
      // Step 3: Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      // Step 4: Convert the entire string to lowercase
      .toLowerCase()
  )
}
