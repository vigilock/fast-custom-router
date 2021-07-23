export default {
  testEnvironment: 'node',
  verbose: false,
  testPathIgnorePatterns: ['__database__.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules', 'bower_components', 'src'],
  modulePathIgnorePatterns: ['__tests__/mocks', '__tests__/config', '__tests__/controller', '__tests__/mock'],
}
