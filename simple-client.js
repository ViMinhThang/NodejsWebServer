const http = require("node:http");

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent: agent,
  hostname: "localhost",
  port: 8050,
  method: "POST",
  path: "/create-post",
  headers: {
    "Content-Type": "application/json",
  },
});
request.on("response", (response) => {});

request.write(JSON.stringify({ message: "Hi there!" }));
request.write(JSON.stringify({ message: "Hi there!" }));
request.write(JSON.stringify({ message: "Hi there!" }));
request.end();
