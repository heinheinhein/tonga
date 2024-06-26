import blessed from "blessed";
import chalk from "chalk";
import { ServerState } from "../../types.js";


const firewalledIcon =
    "⠀⠀⠀⠀⢠⣤⣀     " + "\n" +
    "⠀⠀⠀⠀⣾⣿⣿⣿⣦⡀  " + "\n" +
    "⠀⠀⢀⣼⣿⣿⣿⣿⣿⣷⡄ " + "\n" +
    "⠀⢠⣾⣿⣿⠿⠛⢻⣿⣿⣿⡀" + "\n" +
    "⢠⣿⣿⡿⠃⠀⠀⠈⣿⣿⣿⡇" + "\n" +
    "⢸⣿⣿⡇⠀⠀⠀⠀⢸⣿⣿⡇" + "\n" +
    "⠀⠻⣿⣧⠀⠀⠀⠀⣼⣿⠟ " + "\n" +
    "⠀⠀⠈⠙⠛⠶⠶⠛⠋⠁  ";

const connectedIcon =
    "⠀⠀⠀⠀⣀⣠⣤⣤⣄⣀    " + "\n" +
    "⠀⢀⣴⠿⠛⠛⠛⣟⣿⣿⣿⣦⡀ " + "\n" +
    "⢠⣿⣇⠀⠀⠀⠈⠛⠃⠈⣙⣿⣿⡄" + "\n" +
    "⣾⣿⣿⡀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣷" + "\n" +
    "⢿⣿⣿⣿⣄⠀⣴⣦⣿⣿⣿⣿⣿⣿" + "\n" +
    "⠘⣿⣿⣿⣿⣶⣧⡸⡿⠻⠿⣿⣿⠃" + "\n" +
    "⠀⠈⠻⣿⣿⣿⣿⣿⡇⣀⣴⠟⠁ " + "\n" +
    "⠀⠀⠀⠀⠉⠙⠛⠛⠛⠉    ";


export function updateConnectionStatusIcon(widget: blessed.Widgets.BoxElement, serverState: ServerState): void {

    if (serverState.connection_status === "connected") {
        widget.setContent(chalk.green(connectedIcon) + "\nCONNECTED");
    }

    if (serverState.connection_status === "disconnected") {
        widget.setContent(chalk.red(connectedIcon) + "\nDISCONNECTED");
    }

    if (serverState.connection_status === "firewalled") {
        widget.setContent(chalk.red(firewalledIcon) + "\nFIREWALLED");
    }
}