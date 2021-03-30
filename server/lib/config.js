const dev = {
    mode: 'development',
    port: process.env.PORT || 5000,
    gateway: require('./gateways/inmemory_gateway'),
    secret: 'chat-app-hash-secret'
}

const prod = {
    mode: 'production',
    port: process.env.PORT || 3000,
    gateway: require('./gateways/fs_gateway.js'),
    secret: 'chat-app-hash-secret'
}

module.exports = process.env.NODE_ENV === 'development' ? dev : prod