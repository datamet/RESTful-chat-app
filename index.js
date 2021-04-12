/**
 * Responsible for starting application
 */

 const { app, ws_server } = require('./server/app')
 const config = require('./server/lib/config')
 
 // Starting web socket server
 if (config.notify) {
     ws_server.listen(config.wsport, () => {
         console.log(`[ws server] Web socket server started on port ${config.wsport}`);
     });
 }
 
 // Starting http rest server
 app.listen(config.port, () => {
     console.log(`[rest server] Http rest server started on ${config.port}`)
     console.log(`[mode] Server's started in ${config.mode} mode`)
 });