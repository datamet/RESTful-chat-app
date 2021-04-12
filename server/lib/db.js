/**
 * Database injector
 * 
 * Injects the right database gateway based on 
 * what environment the server is running in.
 */


const FSGateway = require('./gateways/fileSystemGateway')
const InMemoryGateway = require('./gateways/memoryGateway')
const { mode } = require('./config')

module.exports = mode === 'development' ? new InMemoryGateway() : new InMemoryGateway()