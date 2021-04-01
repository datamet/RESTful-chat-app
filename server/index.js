/**
 * Responsible for starting application
 */

const app = require('./app')
const config = require('./lib/config')

app.listen(config.port, () => {
    console.log(`starting server on ${config.port} in ${config.mode} mode`)
});