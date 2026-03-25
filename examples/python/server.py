import socket
import json
import threading

cats = {}
next_id = 1
lock = threading.Lock()


def parse_request(data):
    text = data.decode("utf-8")
    request_line, rest = text.split("\r\n", 1)
    method, path, _ = request_line.split(" ")
    body_index = text.find("\r\n\r\n")
    body = text[body_index + 4:] if body_index != -1 else ""
    return method, path, body


def json_response(status_code, status_text, body):
    payload = json.dumps(body)
    return (
        f"HTTP/1.1 {status_code} {status_text}\r\n"
        f"Content-Type: application/json\r\n"
        f"Content-Length: {len(payload.encode('utf-8'))}\r\n"
        f"Connection: close\r\n"
        f"\r\n"
        f"{payload}"
    ).encode("utf-8")


def route(method, path, body):
    global next_id

    if method == "GET" and path == "/cats":
        return json_response(200, "OK", list(cats.values()))

    if method == "POST" and path == "/cats":
        cat = json.loads(body)
        with lock:
            cat["id"] = next_id
            cats[next_id] = cat
            next_id += 1
        return json_response(201, "Created", cat)

    return json_response(404, "Not Found", {"error": "Not found"})


def handle_client(client_socket):
    try:
        data = client_socket.recv(4096)
        if data:
            method, path, body = parse_request(data)
            response = route(method, path, body)
            client_socket.sendall(response)
    finally:
        client_socket.close()


def start_server(host="127.0.0.1", port=3000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((host, port))
        server_socket.listen()
        print(f"Server listening on port {port}")

        while True:
            client_socket, _ = server_socket.accept()
            threading.Thread(target=handle_client, args=(client_socket,)).start()


if __name__ == "__main__":
    start_server()
