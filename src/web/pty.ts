import { platform } from "node:os";
import pty from "node-pty";
import xterm from "@xterm/headless";
import { SerializeAddon } from "@xterm/addon-serialize";


const cols = 192,
    rows = 50;

const shell = platform() === "win32" ? "powershell.exe" : "sh";

export const process = pty.spawn(shell, [], { cols, rows });
process.onExit((_error) => {
    throw new Error("Dashboard exited");
});


// create an xterm terminal which copies the output from the ptyprocess, so we can read the entire terminal buffer with the serialize addon
const terminal = new xterm.Terminal({ cols, rows, allowProposedApi: true });
export const serializeAddon = new SerializeAddon();
terminal.loadAddon(serializeAddon);

process.onData((data) => {
    terminal.write(data);
});


// start the dashboard
process.write("npm run dashboard; exit\r");