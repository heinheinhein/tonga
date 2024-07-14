import { Terminal } from "@xterm/xterm";


function init(): void {

    const term = createTerminal();

    connectToStdout(term);
}

function createTerminal(): Terminal {

    const cols = 192,
        rows = 49;

    const term = new Terminal({ cols, rows });

    let termElement = document.getElementById("terminal");
    if (!termElement) {
        termElement = document.createElement("div");
        termElement.id = "terminal";
        document.body.append(termElement);
    }

    term.open(termElement);

    const cowsay = [
        " _____________",
        "< connecting… >",
        " -------------",
        "        \\   ^__^",
        "         \\  (oo)\\_______",
        "            (__)\\       )\\/\\",
        "                ||----w |",
        "                ||     ||"
    ];

    // center this cow
    const cowWidth = 28,
        cowHeight = 8;

    const cursorX = Math.floor((cols + 1 - cowWidth) / 2);
    const cursorY = Math.floor((rows + 1 - cowHeight) / 2);

    cowsay.forEach((line, index) => {
        // move cursor and write line
        term.write(`\x1b[${cursorY + index};${cursorX}H` + line);
    });

    return term;
}

function connectToStdout(terminal: Terminal): EventSource {

    const stdout = new EventSource("/stdout");

    stdout.addEventListener("open", (_event) => { });

    stdout.addEventListener("termdata", (event) => {
        // if its the first message, clear the terminal (terminal.clear() does not do the job for some reason)
        if (event.lastEventId === "0") terminal.write("\x1b[2J");

        terminal.write(event.data);
    });

    return stdout;
}


window.onload = init;