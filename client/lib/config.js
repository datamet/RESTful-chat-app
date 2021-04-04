/**
 * Config file
 */

let env

if(typeof process === 'object') env = 'node'
else env = 'browser'

const dev = {
    env,
    host: env === 'node' ? process.env.HOST || 'localhost' : '192.168.0.60',
    port: env === 'node' ? process.env.PORT || 5000 : 5000
}

export default dev