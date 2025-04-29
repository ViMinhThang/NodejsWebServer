const http = require("node:http");
const fs = require("node:fs/promises");
const server = http.createServer();

server.on("request", async (request, response) => {
  if (request.url === "/" && request.method === "GET") {
    response.setHeader("Content-Type", "text/html");

    const fileHandle = await fs.open("./public/index.html", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(response);
  }
  if (request.url === "/styles.css" && request.method === "GET") {
    response.setHeader("Content-Type", "text/css");

    const fileHandle = await fs.open("./public/styles.css", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(response);
  }
  if (request.url === "/script.js" && request.method === "GET") {
    response.setHeader("Content-Type", "text/javascript");

    const fileHandle = await fs.open("./public/script.js", "r");
    const fileStream = fileHandle.createReadStream();
    fileStream.pipe(response);
  }
  if (request.url === "/login" && request.method === "POST") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;

    const body = {
      message: "Logging you in ....",
    };

    response.end(JSON.stringify(body));
  }
  if (request.url === "/user" && request.method === "PUT") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;

    const body = {
      message: "Updating your info...",
    };

    response.end(JSON.stringify(body));
  }
});

server.listen(9000, () => {
  console.log("Web server is live at http://localhost:9000");
});
