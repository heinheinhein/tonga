import { Terminal } from "@xterm/xterm";


async function init(): Promise<void> {

    const termElement = document.getElementById("terminal");

    if (!termElement) return;

    const cols = 192,
        rows = 50;

    const term = new Terminal({ cols, rows });

    term.open(termElement);
    term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
}

init();