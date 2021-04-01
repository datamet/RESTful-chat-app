/**
 * Database injector
 * 
 * Injects the right database gateway based on 
 * what environment the server is running in.
 */


const FSGateway = require('./gateways/fs_gateway')
const InMemoryGateway = require('./gateways/inmemory_gateway')
const { mode } = require('./config')

module.exports = mode === 'development' ? new InMemoryGateway() : new FSGateway()