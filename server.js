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
});

server.listen(9000, () => {
  console.log("Web server is live at http://localhost:9000");
});
