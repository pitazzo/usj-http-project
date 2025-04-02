const net = require('net');
const readline = require('readline');

const HOST = '127.0.0.1';
const PORT = 8080;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function buildAndSendRequest() {
    const method = (await ask('Método HTTP (GET, POST, PUT, DELETE, HEAD): ')).toUpperCase();
    const path = await ask('Ruta (ej. /cats): ');
    const headersInput = await ask('Headers (formato clave:valor separados por coma, ej. key:123,Auth:abc): ');
    const body = await ask('Cuerpo (solo se usará si es POST o PUT): ');

    // Parsear headers
    const headers = headersInput.split(',').filter(Boolean).map(h => h.trim());
    let headersStr = `Host: localhost\r\nConnection: close\r\n`;
    headers.forEach(h => headersStr += h.replace(':', ': ') + '\r\n');

    // Si hay cuerpo, incluir Content-Length
    let request = `${method} ${path} HTTP/1.1\r\n${headersStr}`;
    if (body && (method === 'POST' || method === 'PUT')) {
        request += `Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`;
    } else {
        request += `\r\n`;
    }

    const client = new net.Socket();
    client.connect(PORT, HOST, () => {
        console.log('\n📤 Enviando solicitud...\n');
        client.write(request);
    });

    client.on('data', (data) => {
        console.log('📥 Respuesta del servidor:\n', data.toString());
    });

    client.on('close', async () => {
        console.log('🔁 Conexión cerrada');
        const again = await ask('\n¿Quieres enviar otra solicitud? (s/n): ');
        if (again.trim().toLowerCase() === 's') {
            buildAndSendRequest();
        } else {
            rl.close();
        }
    });
}

buildAndSendRequest();

