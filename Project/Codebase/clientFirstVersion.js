const net = require('net');

// Definir la dirección y el puerto del servidor
const HOST = '127.0.0.1';
const PORT = 8080;

// Crear un socket TCP para el cliente
const client = new net.Socket();

// Conectar al servidor
client.connect(PORT, HOST, () => {
    console.log('Conectado al servidor');

    // Enviar una solicitud HTTP GET
    const request = 'GET / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n';
    client.write(request);
});

// Recibir la respuesta del servidor
client.on('data', (data) => {
    console.log('Respuesta del servidor:\n', data.toString());
});

// Manejar cierre de la conexión
client.on('close', () => {
    console.log('Conexión cerrada');
});
