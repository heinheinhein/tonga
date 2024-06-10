import blessed from "blessed";
import contrib from "blessed-contrib";

import { updatePeersWidgets } from "./widgets/peers.js";
import { updateTransferInfoWidgets } from "./widgets/transferinfo.js";
import { updateSystemInfoWidget } from "./widgets/systeminfo.js";


const screen = blessed.screen({});

const gridSize = {
    width: 16,
    height: 9
};

const grid = new contrib.grid({ cols: gridSize.width, rows: gridSize.height, screen: screen });


// widgets
//  grid location is (y, x, heigth, width) which is very confusing
const activePeersLocation = grid.set(0, 0, 5, 9, contrib.map, {
    label: "Active Peers - Location"
});

const activePeersList = grid.set(5, 0, 4, 9, contrib.table, {
    label: "Active Peers - List",
    keys: true,
    interactive: false,
    columnSpacing: 6,
    columnWidth: [17, 21, 22, 10, 10, 8]
});

const transferSpeedLine = grid.set(0, 9, 4, 4, contrib.line, {
    label: "Transfer Speed (MiB/s)",
    showLegend: true,
    showNthLabel: 10,
    legend: { width: 10 }
});

const uploadSparkLine = grid.set(0, 13, 2, 3, contrib.sparkline, {
    label: "Upload Speed",
    tags: true,
    style: {
        fg: "cyan",
        text: "white",
    },
    valign: "middle",
});

const downloadSparkline = grid.set(2, 13, 2, 3, contrib.sparkline, {
    label: "Download Speed",
    tags: true,
    style: {
        fg: "green",
        text: "white",
    },
    valign: "middle"
});

const activePeersCountriesHist = grid.set(4, 9, 4, 5, contrib.bar, {
    label: "Active Peers - Countries",
    barWidth: 3,
    barSpacing: 6,
    xOffset: 2,
    maxHeight: 2
});


const connectionStatusIcon = grid.set(4, 14, 2, 2, blessed.box, {
    label: "Connection Status",
    align: "center"
});


const systemInfoBox = grid.set(8, 14, 1, 2, blessed.box, {
    label: "qBittorrent Info",
    align: "center"
});


// update the widgets about peers
setInterval(updatePeersWidgets, 1e3,
    activePeersLocation,
    activePeersList,
    uploadSparkLine,
    downloadSparkline,
    activePeersCountriesHist
);

// update the transfer info widgets
setInterval(updateTransferInfoWidgets, 1e3,
    transferSpeedLine,
    connectionStatusIcon
);

// update the system info box
updateSystemInfoWidget(systemInfoBox);
setInterval(updateSystemInfoWidget, 60e3, systemInfoBox);

setInterval(() => { screen.render(); }, 1e3);



screen.key(["escape", "q", "C-c"], function (_ch, _key) {
    return process.exit(0);
});

screen.render();