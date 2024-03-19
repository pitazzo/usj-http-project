import socket

def handle_request(data):
    request = data.decode('utf-8')

    body_index = request.find("\r\n\r\n")
    body = request[body_index+4:]

    response = f"HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\nEchoing back your request body:\r\n{body}"
    return response.encode('utf-8')

def start_server(host='127.0.0.1', port=3000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind((host, port))
        server_socket.listen()

        print(f"Server listening on port {port}")

        while True:
            client_socket, address = server_socket.accept()
            print(f"Client connected from {address}")

            with client_socket:
                data = client_socket.recv(1024)
                if data:
                    response = handle_request(data)
                    client_socket.sendall(response)
                print("Client disconnected")

if __name__ == '__main__':
    start_server()
