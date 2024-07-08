import blessed from "blessed";
import chalk from "chalk";
import { ServerState } from "../../types.js";
import { fixStringLength, formatBytes } from "../../util.js";

export function updateAlltimeStats(widget: blessed.Widgets.BoxElement, serverState: ServerState): void {

    const boxWidth = 20;

    const content =
        `${chalk.green("Up ↑")} ${fixStringLength(formatBytes(serverState.alltime_ul), boxWidth - 5, true)}\n` +
        `${chalk.green("Down ↓")} ${fixStringLength(formatBytes(serverState.alltime_dl), boxWidth - 7, true)}\n` +
        `${chalk.green("Ratio")} ${fixStringLength(serverState.global_ratio, boxWidth - 6, true)}`;

    widget.setContent(content);
}