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


function sanitizeBuffer(buffer: string): string {
    // remove newlines from buffer because this breaks the event-stream and are not needed
    buffer = buffer.replaceAll("\r", "").replaceAll("\n", "");

    // bold text fricks up the char width and spacing on firefox on linux (idk why)
    //  so here is some regex to remove the bold ansi escape codes from the buffer :)
    //  the escape code is "[1m", but can be chucked in with other styling codes like color, ie "[32;1m" (set green foreground with 32 and bold with 1)
    //  more examples here: https://gist.github.com/ConnerWill/d4b6c776b509add763e17f9f113fd25b#colors--graphics-mode
    const boldPattern = /\x1b\[([0-9;]*)1([0-9;]*)m/g;
    const removeBold = (_match: string, p1: string, p2: string) => {
        // Reconstruct the escape code without '1'
        const newCode = `${p1}${p2}`.replace(/;;/, ';').replace(/^;|;$/, ''); // Remove double semicolons or leading/trailing semicolons
        return `\x1b[${newCode}m`;
    };

    buffer = buffer.replace(boldPattern, removeBold);

    return buffer;
}


export const stdout: ServerRoute = {
    method: "GET",
    path: "/stdout",
    handler: function (request: Request, h: ResponseToolkit) {

        const responseStream = new ResponseStream();

        // send entire buffer of the terminal to the responsestream
        // this is because new data from the ptyprocess only contains parts of the terminal which are changed compared to the previous state
        let buffer = serializeAddon.serialize();

        // remove some breaking characters
        buffer = sanitizeBuffer(buffer);

        // split the buffer so that only the output from blessed is sent to the client, not the command used to start the dashboard
        // "[?1049h" is the first ansi escape sequence sent by blessed (to enable the alternative screen buffer)
        buffer = buffer.split("\x1b[?1049h")[1];

        if (buffer) {
            responseStream.write("id: 0\n");
            responseStream.write("event: termdata\n");
            responseStream.write(`data: ${buffer}\n`);
            responseStream.write("\n");
        }

        // send new data from the ptyprocess to the responsestream
        let i = 1;
        const dataListener = process.onData((data) => {
            data = sanitizeBuffer(data);

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