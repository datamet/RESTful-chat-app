/**
 * Config file
 */

let env

if(typeof process === 'object') env = 'node'
else env = 'browser'

const dev = {
    env,
    host: env === 'node' ? process.env.HOST || 'localhost' : 'localhost',
    port: env === 'node' ? process.env.PORT || 5000 : 5000
}

export default dev