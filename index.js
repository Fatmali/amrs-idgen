'use strict';

const Hapi = require('hapi');
const mysql = require('mysql');
const config = require('./src/config/config');
const def = require('./src/connection/connection');
const tls = require('tls');
const fs = require('fs');
const Inert = require('inert');

var routes = require('./src/routes/routes');

const server = new Hapi.Server();

var tls_config = false;

if (config.application.tls) {
    tls_config = tls.createServer({
        key: fs.readFileSync(config.application.key),
        cert: fs.readFileSync(config.application.cert)
    });
}

server.connection({
        port: config.application.port,
        host: config.application.host,
        tls: tls_config
});

for (var route in routes) {
        server.route(routes[route]);
}

/* server.start((err) => {

         if (err) {
                 throw err;
         }
         console.log(`Server running at: ${server.info.uri}`);
});*/
server.register(Inert, (error) => {
        if (error) {
                throw error;
        } else {
                server.start((error) => {
                        if (error) {
                                throw error;
                        }
                        else {
                                console.log(`Server running at: ${server.info.uri}`);
                        }
                });
        }
});
