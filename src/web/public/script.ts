import { Terminal } from "@xterm/xterm";


function init(): void {

    const termElement = document.getElementById("terminal");

    if (!termElement) return;

    const cols = 192,
        rows = 50;

    const term = new Terminal({ cols, rows });

    term.open(termElement);


    const stdout = new EventSource("/stdout");

    stdout.addEventListener("open", (_event) => console.log("connected"));
    stdout.addEventListener("termdata", (event) => {
        term.write(event.data)
    });
}

init();