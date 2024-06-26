import { ServerState, ServerStateWidgets } from "../types.js";
import { updateConnectionStatusIcon } from "./serverstate/connectionstatus.js";
import { updateAlltimeStats } from "./serverstate/alltimestats.js";
import { updateTransferSpeedLine } from "./serverstate/transferspeed.js";

export function updateServerStateWidgets(serverState: ServerState, widgets: ServerStateWidgets): void {

    updateConnectionStatusIcon(widgets.connectionStatusIcon, serverState);
    updateTransferSpeedLine(widgets.transferSpeedLine, serverState);
    updateAlltimeStats(widgets.alltimeStatsInfoBox, serverState);
}