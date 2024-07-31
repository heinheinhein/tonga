import { Terminal } from "@xterm/xterm";
//@ts-ignore: gets the location of an asset after build
import fontUrl from "./cascadia-code/CascadiaMono.woff2";


async function init(): Promise<void> {

    await loadFonts();

    const terminal = createTerminal();

    connectToStdout(terminal);
}


async function loadFonts(): Promise<void> {
    const fontFile = new FontFace(
        "Cascadia Mono",
        `url(${fontUrl})`,
    );

    document.fonts.add(fontFile);

    await fontFile.load();
    return;
}


function createTerminal(): Terminal {

    const cols = 192,
        rows = 49;

    const terminal = new Terminal({
        cols,
        rows,
        disableStdin: true,
        fontFamily: "Cascadia Mono",
        theme: {
            black: "#000000",
            green: "#40d921",
            blue: "#268BF6",
            red: "#FF3131",
            cyan: "#CCCCCC",
            selectionBackground: "#000000",
            selectionForeground: "#FFFFFF"
        }
    });

    let termElement = document.getElementById("terminal");
    if (!termElement) {
        termElement = document.createElement("div");
        termElement.id = "terminal";
        document.body.append(termElement);
    }

    terminal.open(termElement);

    // hide cursor
    terminal.write("\x1b[?25l");

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
        terminal.write(`\x1b[${cursorY + index};${cursorX}H` + line);
    });

    return terminal;
}

function connectToStdout(terminal: Terminal): EventSource {

    const stdout = new EventSource("/stdout");

    stdout.addEventListener("open", (_event) => { });

    stdout.addEventListener("termdata", (event) => {
        // if its the first message, clear the terminal
        if (event.lastEventId === "0") terminal.clear();

        terminal.write(event.data);
    });

    return stdout;
}


window.onload = init;