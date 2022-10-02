const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    
    // console.log(client.handshake);
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    // if(!valido) { return client.disconnect(); }
    // client.join(uid);

    client.on('prueba', (payload) => {
        console.log(payload);
        io.emit('prueba', payload);
    });

    client.on('web', (payload) => {
        console.log(payload);
        io.emit('enviarmovil', payload);
    });


    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);
    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    // });
});
