export const splitIntoLines = (str: string, n = 10): string => {
  const result = []
  let current = 0

  while (current < str.length) {
    if (str.length - current <= Math.round(1.5 * n)) {
      result.push(str.slice(current))
      break
    }
    result.push(str.slice(current, current + n))
    current += n
  }

  return result.join('\n')
}
