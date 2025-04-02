const net = require('net');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 8080;

const server = net.createServer((socket) => {
    console.log('Cliente conectado');

    socket.on('data', (data) => {
        const request = data.toString();
        console.log('Solicitud recibida:\n', request);

        const [requestHeaders, body] = request.split('\r\n\r\n');
        const [requestLine, ...headerLines] = requestHeaders.split('\r\n');
        const [method, pathRequested] = requestLine.split(' ');

        // RUTAS PERSONALIZADAS
        if (method === 'GET') {
            if (pathRequested === '/cat.json') {
                const filePath = path.join(__dirname, 'cat.json');

                fs.readFile(filePath, (err, fileData) => {
                    if (err) {
                        const response = `HTTP/1.1 500 Internal Server Error\r\n\r\n<h1>Error al leer cat.json</h1>`;
                        socket.write(response);
                        socket.end();
                        return;
                    }

                    const response = `HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: ${fileData.length}\r\n\r\n${fileData}`;
                    socket.write(response);
                    socket.end();
                });
            } else {
                // Si pide otro archivo, intentamos servirlo desde disco (ej. cat.png)
                const filePath = path.join(__dirname, pathRequested);
                fs.readFile(filePath, (err, fileData) => {
                    if (err) {
                        const response = `HTTP/1.1 404 Not Found\r\n\r\n<h1>Archivo no encontrado</h1>`;
                        socket.write(response);
                        socket.end();
                        return;
                    }

                    // Detectar tipo MIME por extensión
                    const ext = path.extname(filePath);
                    let contentType = 'application/octet-stream';
                    if (ext === '.html') contentType = 'text/html';
                    if (ext === '.json') contentType = 'application/json';
                    if (ext === '.png') contentType = 'image/png';
                    if (ext === '.mp3') contentType = 'audio/mpeg';

                    const response = `HTTP/1.1 200 OK\r\nContent-Type: ${contentType}\r\nContent-Length: ${fileData.length}\r\n\r\n`;
                    socket.write(response);
                    socket.write(fileData);
                    socket.end();
                });
            }
        } else {
            const response = `HTTP/1.1 405 Method Not Allowed\r\n\r\n<h1>Método no permitido</h1>`;
            socket.write(response);
            socket.end();
        }
    });

    socket.on('end', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
