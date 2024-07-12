import Hapi from "@hapi/hapi";
import inert from "@hapi/inert";
import path from "path";

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



server.route({
    method: "GET",
    path: "/",
    handler: {
        file: {
            path: path.join(import.meta.dirname, "public", "index.html")
        }
    }
});


server.route({
    method: "GET",
    path: "/assets/{param*}",
    handler: {
        directory: {
            path: path.join(import.meta.dirname, "public", "assets"),
            index: false
        }
    }
});


server.route({
    method: "GET",
    path: "/stdout",
    handler: function (request, h) {
        return "/stdout";
    }
})



await server.start();
console.log(`Server running on ${server.info.uri}`);
