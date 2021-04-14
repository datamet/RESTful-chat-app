/**
 * Responsible for starting application
 */

const { server } = require('./server')
const config = require('./lib/config')

// Starting http rest server
server.listen(config.port, () => {
    console.log(`[server] server started on ${config.port}`)
    console.log(`[mode] Server's started in ${config.mode} mode`)
});