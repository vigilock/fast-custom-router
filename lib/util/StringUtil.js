const newLine = '\n'

/**
 * Indent a text.
 *
 * @param {string} str Text to ident
 * @param {string} fill Text to fill
 * @param {number} it Number of indentation
 * @returns {string} Indented text
 */
export function padStartText(str, fill = ' ', it = 1) {
  return str
    .split(newLine)
    .map(line => {
      return fill.repeat(it) + line
    })
    .join(newLine)
}
