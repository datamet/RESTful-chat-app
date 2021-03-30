const dev = {
    mode: 'development',
    port: process.env.PORT || 5000,
    debug: true
}

const prod = {
    mode: 'production',
    port: process.env.PORT || 3000,
    debug: false
}

module.exports = process.env.NODE_ENV === 'development' ? dev : prod