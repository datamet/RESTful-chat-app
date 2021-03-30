const dev = {
    mode: 'development',
    port: process.env.PORT || 5000
}

const prod = {
    mode: 'production',
    port: process.env.PORT || 3000
}

module.exports = process.env.NODE_ENV === 'development' ? dev : prod