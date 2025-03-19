const net = require('net');

// Definir la dirección y el puerto del servidor
const HOST = '127.0.0.1';
const PORT = 8080;

// Crear un servidor TCP
const server = net.createServer((socket) => {
    console.log('Cliente conectado');

    socket.on('data', (data) => {
        const request = data.toString();
        console.log('Solicitud recibida:\n', request);

        // Separar los encabezados del cuerpo de la solicitud (si existe)
        const [requestHeaders, body] = request.split('\r\n\r\n');

        // Analizar el método HTTP
        const [method, path] = requestHeaders.split(' ');

        // Manejar la solicitud según el método HTTP (GET o POST)
        if (method === 'GET') {
            // Responder con un archivo o mensaje estático para GET
            if (path === '/index.html') {
                const response = `HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>¡Bienvenido a mi servidor HTTP!</h1>`;
                socket.write(response);
            } else {
                const response = `HTTP/1.1 404 Not Found\r\n\r\n<h1>Recurso no encontrado</h1>`;
                socket.write(response);
            }
        } else if (method === 'POST') {
            // Procesar datos recibidos con POST
            console.log('Datos recibidos en POST:', body);

            const response = `HTTP/1.1 201 Created\r\nContent-Type: text/html\r\n\r\n<h1>Recurso creado</h1>`;
            socket.write(response);
        } else {
            // Responder con un error si el método no es GET o POST
            const response = `HTTP/1.1 405 Method Not Allowed\r\n\r\n<h1>Metodo no permitido</h1>`;
            socket.write(response);
        }

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
