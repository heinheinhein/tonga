import blessed from "blessed";
import chalk from "chalk";
import { ServerState } from "../../types.js";
import { fixStringLength, formatBytes } from "../../util.js";

export function updateAlltimeStats(widget: blessed.Widgets.BoxElement, serverState: ServerState): void {

    const boxWidth = 20;

    const content =
        `${chalk.green("Upload")} ${fixStringLength(formatBytes(serverState.alltime_ul), boxWidth - 7, true)}\n` +
        `${chalk.green("Download")} ${fixStringLength(formatBytes(serverState.alltime_dl), boxWidth - 9, true)}\n` +
        `${chalk.green("Ratio")} ${fixStringLength(serverState.global_ratio, boxWidth - 6, true)}`;

    widget.setContent(content);
}