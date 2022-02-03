const express = require('express');
const path = require('path');
require('dotenv').config();

// DB config
require('./database/config').dbConnection();

// App de Express
const app = express();

// Lectura y parseo del Body
app.use(express.json());

// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');




// Path público
const publicPath = path.resolve( __dirname, 'public' );
const publicPathLogin = path.resolve( __dirname, 'public/login' );
app.use( express.static( publicPath ) );

app.use( express.static( publicPathLogin ));

// Mis rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/reporte', require('./routes/reportes'));
app.use('/api/actualizar', require('./routes/actualizar'));

server.listen( process.env.PORT, ( err ) => {

    if ( err ) throw new Error(err);

    console.log('Servidor corriendo en puerto', process.env.PORT );

});


