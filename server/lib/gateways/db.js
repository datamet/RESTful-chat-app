const FSGateway = require('./fs_gateway')
const InMemoryGateway = require('./inmemory_gateway')
const { mode } = require('../config')

module.exports = mode === 'development' ? new InMemoryGateway() : new FSGateway()