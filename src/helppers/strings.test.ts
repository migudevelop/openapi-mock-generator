import { toKebabCase } from './strings'

describe('strings.ts', () => {
  describe('toKebabCase', () => {
    it('should convert a string to KebabCase', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world')
      expect(toKebabCase('hello_world')).toBe('hello-world')
      expect(toKebabCase('Hello World')).toBe('hello-world')
    })
  })
})
