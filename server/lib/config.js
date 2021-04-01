/**
 * Configruation file
 */

const dev = {
    mode: 'development',
    port: process.env.PORT || 5000,
    debug: true,
    tokenExpiration: 1000 * 60 * 60
}

const prod = {
    mode: 'production',
    port: process.env.PORT || 8080,
    debug: false,
    tokenExpiration: 1000 * 60 * 60 * 24
}

module.exports = process.env.NODE_ENV === 'development' ? dev : prod