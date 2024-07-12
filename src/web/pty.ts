import { platform } from "node:os";
import pty from "node-pty";

const shell = platform() === "win32" ? "powershell.exe" : "sh";

export const ptyProcess = pty.spawn(shell, [], {
    cols: 192,
    rows: 50,
});


ptyProcess.onData((_data) => { });

ptyProcess.onExit((_error) => {
    throw new Error("Dashboard exited");
});

ptyProcess.write('npm run dashboard; exit\r');