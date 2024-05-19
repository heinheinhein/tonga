import qb from "../qbittorrent.js";
import { updateConnectionStatusIcon } from "./transferinfo/connectionstatus.js";
import { updateTransferSpeedLine } from "./transferinfo/transferspeed.js";



export async function updateTransferInfoWidgets(transferSpeedWidget: any, connectionStatusWidget: any): Promise<void> {

    const transferInfo = await qb.transferInfo();

    updateTransferSpeedLine(transferSpeedWidget, transferInfo);
    updateConnectionStatusIcon(connectionStatusWidget, transferInfo);
}