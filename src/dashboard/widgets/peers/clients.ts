import blessed from "blessed";
import chalk from "chalk";
import { EnhancedPeer } from "../peers.js";
import { fixStringLength, substringWithEllipsis } from "../../util.js";

export function updateClientsList(widget: blessed.Widgets.BoxElement, peers: EnhancedPeer[]): void {

    const boxWidth = 20;

    const clients = peers.map((peer) => {
        // regex to remove version numbers etc.
        return peer.client.replaceAll(/[\.\d\/]/g, "").trim();
    });
    const uniqueClients = [...new Set(clients)];


    uniqueClients.sort((a, b) => {
        const countOfA = clients.filter((value) => value === a).length;
        const countOfB = clients.filter((value) => value === b).length;
        return countOfB - countOfA;
    });

    uniqueClients.splice(9);


    let content = "";

    uniqueClients.forEach((uniqueClient) => {

        // shorten client name if it is to long
        const clientName = substringWithEllipsis(uniqueClient, 15);

        // add the client name and count to the widget content
        content += `${chalk.green(clientName)} ${fixStringLength(clients.filter((filterClient) => filterClient === uniqueClient).length.toString(), boxWidth - 1 - clientName.length, true)}\n`
    });

    widget.setContent(content);


}