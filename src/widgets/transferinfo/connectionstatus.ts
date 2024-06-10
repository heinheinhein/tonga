import chalk from "chalk";
import { TransferInfo } from "../../types.js";


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


export function updateConnectionStatusIcon(widget: any, transferInfo: TransferInfo): void {

    if (transferInfo.connection_status === "connected") {
        widget.setContent(chalk.green(connectedIcon) + "\nCONNECTED");
    }

    if (transferInfo.connection_status === "disconnected") {
        widget.setContent(chalk.red(connectedIcon) + "\nDISCONNECTED");
    }

    if (transferInfo.connection_status === "firewalled") {
        widget.setContent(chalk.red(firewalledIcon) + "\nFIREWALLED");
    }
}