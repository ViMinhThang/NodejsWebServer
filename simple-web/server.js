const Butter = require("../butter");

const PORT = 4060;

const server = new Butter();

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/script.js", (req, res) => {
  res.sendFile("./public/script.js", "text/javascript");
});

server.route("post", "/login", (req, res) => {
  res.status(400).send({ message: "Bad login info." });
});

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
