const net = require("net");

const cats = new Map();
let nextId = 1;

const parseRequest = (data) => {
  const request = data.toString();
  const [requestLine, ...rest] = request.split("\r\n");
  const [method, path] = requestLine.split(" ");
  const bodyIndex = request.indexOf("\r\n\r\n");
  const body = bodyIndex !== -1 ? request.substring(bodyIndex + 4) : "";
  return { method, path, body };
};

const jsonResponse = (statusCode, statusText, body) => {
  const json = JSON.stringify(body);
  return (
    `HTTP/1.1 ${statusCode} ${statusText}\r\n` +
    `Content-Type: application/json\r\n` +
    `Content-Length: ${Buffer.byteLength(json)}\r\n` +
    `Connection: close\r\n` +
    `\r\n` +
    json
  );
};

const routes = {
  "GET /cats": () => {
    return jsonResponse(200, "OK", [...cats.values()]);
  },

  "POST /cats": (body) => {
    const cat = JSON.parse(body);
    cat.id = nextId++;
    cats.set(cat.id, cat);
    return jsonResponse(201, "Created", cat);
  },
};

const handleRequest = ({ method, path, body }) => {
  const routeKey = `${method} ${path}`;
  const handler = routes[routeKey];

  if (handler) {
    return handler(body);
  }

  return jsonResponse(404, "Not Found", { error: "Not found" });
};

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = parseRequest(data);
    const response = handleRequest(request);
    socket.end(response);
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
