import Hapi from "@hapi/hapi";
import inert from "@hapi/inert";
import { index, assets } from "./routes/static.js";
import { stdout } from "./routes/stdout.js";


process.on("unhandledRejection", (err) => {
    console.error(err);
    process.exit(1);
});

let port = 8676;
if (process.env.PORT) port = parseInt(process.env.PORT);

const server = Hapi.server({
    host: "localhost",
    port: port
});

await server.register(inert);

server.route(index);
server.route(assets);
server.route(stdout);

await server.start();
console.log(`Server running on ${server.info.uri}`);
