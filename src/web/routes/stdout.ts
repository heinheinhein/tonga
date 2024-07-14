import { ServerRoute, Request, ResponseToolkit } from "@hapi/hapi";
import { Stream } from "stream";
import { process, serializeAddon } from "../pty.js";


// not sure what this does but it works; see https://github.com/hapijs/hapi/issues/3599#issuecomment-485190525
class ResponseStream extends Stream.PassThrough {
    compressor: any;
    setCompressor(compressor: any) {
        this.compressor = compressor;
    }
}


export const stdout: ServerRoute = {
    method: "GET",
    path: "/stdout",
    handler: function (request: Request, h: ResponseToolkit) {

        const responseStream = new ResponseStream();

        // send entire buffer of the terminal to the responsestream
        // this is because new data from the ptyprocess only contains parts of the terminal which are updated
        let buffer = serializeAddon.serialize();

        // remove newlines from buffer because this breaks the event-stream
        buffer = buffer.replaceAll("\r", "").replaceAll("\n", "")

        // split the buffer so that only the output from blessed is sent to the client, not the command used to start the dashboard
        // "[?1049h" is the first ansi escape sequence sent by blessed (to enable the alternative screen buffer (https://en.wikipedia.org/wiki/ANSI_escape_code))
        buffer = buffer.split("\x1b[?1049h")[1];

        responseStream.write("id: 0\n");
        responseStream.write("event: termdata\n");
        responseStream.write(`data: ${buffer}\n`);
        responseStream.write("\n");


        // send new data from the ptyprocess to the responsestream
        let i = 1;
        const dataListener = process.onData((data) => {
            responseStream.compressor.flush();
            responseStream.write(`id: ${i}\n`);
            responseStream.write("event: termdata\n");
            responseStream.write(`data: ${data}\n`);
            responseStream.write("\n");

            i++;
        });


        // dispose ondata event listener if connection is closed
        request.raw.req.on("close", () => {
            dataListener.dispose();
        });


        // return the responsestream as an event-stream
        return h.response(responseStream)
            .code(200)
            .type("text/event-stream")
            .header("Connection", "keep-alive")
            .header("Cache-Control", "no-cache")
            .header("X-Accel-Buffering", "no");
    }
}