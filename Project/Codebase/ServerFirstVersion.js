const net = require('net');

// Definir la dirección y el puerto del servidor
const HOST = '127.0.0.1';
const PORT = 8080;

// Crear un servidor TCP
const server = net.createServer((socket) => {
    console.log('Cliente conectado');

    socket.on('data', (data) => {
        console.log('Solicitud recibida:\n', data.toString());

        // Analizar la solicitud HTTP (muy básico)
        const request = data.toString();

        // Responder con un mensaje HTTP
        const response = `HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>¡Hola desde el servidor HTTP!</h1>`;
        socket.write(response);

        // Cerrar la conexión
        socket.end();
    });

    socket.on('end', () => {
        console.log('Cliente desconectado');
    });
});

// El servidor escuchará en el puerto 8080
server.listen(PORT, HOST, () => {
    console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
