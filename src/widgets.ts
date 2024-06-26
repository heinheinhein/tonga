import blessed from "blessed";
import { Widgets } from "./types.js";
import qb from "./qbittorrent.js";
import { updatePeersWidgets } from "./widgets/peers.js";
import { updateServerStateWidgets } from "./widgets/serverstate.js";
import { updateTorrentsWidgets } from "./widgets/torrents.js";

let refreshInterval: NodeJS.Timeout;

export async function updateWidgets(screen: blessed.Widgets.Screen, widgets: Widgets): Promise<void> {
    // start the update interval if this is the first time this function is called
    if (!refreshInterval) refreshInterval = setInterval(updateWidgets, 1500, screen, widgets);


    const maindata = await qb.syncMaindata();

    updateTorrentsWidgets(maindata.torrents, widgets);

    updatePeersWidgets(maindata.torrents, widgets);

    updateServerStateWidgets(maindata.server_state, widgets);

    widgets.timeBox.setContent("\n" + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

    screen.render();
}