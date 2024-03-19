import socket

server = 'example.com'
port = 80

request = f"GET / HTTP/1.1\r\nHost: {server}\r\nConnection: close\r\n\r\n"

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((server, port))
    s.send(request.encode())
    response = b""
    while True:
        data = s.recv(1024)
        if not data:
            break
        response += data
    print(response.decode())
