/**
 * Config file
 */

const env = process ? 'node' : 'browser'

const dev = {
    env,
    host: env === 'node' ? process.env.HOST || 'localhost' : 'localhost',
    port: env === 'node' ? process.env.PORT || 5000 : '5000'
}

export default dev