/**
 * Configruation file
 */

const dev = {
    mode: 'development',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000,
    notify:  process.env.NOTIFY === 'false' ? false : true,
    debug: true,
    tokenExpiration: 1000 * 60 * 60
}

const prod = {
    mode: 'production',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000,
    notify:  process.env.NOTIFY === 'false' ? false : true,
    debug: false,
    tokenExpiration: 1000 * 60 * 60 * 24
}

module.exports = process.env.NODE_ENV === 'development' ? dev : prod