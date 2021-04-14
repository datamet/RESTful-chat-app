/**
 * Config file
 */

let env

if(typeof process === 'object') env = 'node'
else env = 'browser'

const config = {
    env,
    push: env === 'node' ? process.env.PUSH || true : true,
    host: env === 'node' ? process.env.HOST || 'localhost' : 'localhost',
    port: env === 'node' ? process.env.PORT || 5000 : 5000
}

export default config