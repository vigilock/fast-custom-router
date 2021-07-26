/**
 * Test controller with user example.
 *
 * @param {number} id User id
 * @returns {object} Result
 */
export default async function getUser(id) {
  return {
    receivedId: id,
  }
}
