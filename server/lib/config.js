/**
 * Configruation file
 */

const dev = {
    mode: 'development',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000,
    wsport: process.env.WS_PORT || 5050,
    debug: true,
    tokenExpiration: 1000 * 60 * 60
}

const prod = {
    mode: 'production',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8080,
    wsport: process.env.WS_PORT || 80,
    debug: false,
    tokenExpiration: 1000 * 60 * 60 * 24
}

module.exports = process.env.NODE_ENV === 'development' ? dev : prod