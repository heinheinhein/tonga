import path from "path";
import { ServerRoute } from "@hapi/hapi";

export const index: ServerRoute = {
    method: "GET",
    path: "/",
    handler: {
        file: {
            path: path.join(import.meta.dirname, "..", "public", "index.html")
        }
    }
};

export const assets: ServerRoute = {
    method: "GET",
    path: "/assets/{param*}",
    handler: {
        directory: {
            path: path.join(import.meta.dirname, "..", "public", "assets"),
            index: false
        }
    }
};