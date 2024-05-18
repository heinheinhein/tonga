import blessed from "blessed";
import contrib from "blessed-contrib";

import { updatePeersWidgets } from "./widgets/peers.js";
import { updateTransferInfoWidget } from "./widgets/transferinfo.js";


const screen = blessed.screen({});

const gridSize = {
    width: 16,
    height: 9
};

const grid = new contrib.grid({ cols: gridSize.width, rows: gridSize.height, screen: screen });


// widgets
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
    showNthLabel: 10
});

const uploadSparkLine = grid.set(0, 13, 2, 3, contrib.sparkline, {
    label: "Upload Speed",
    tags: true,
    style: {
        fg: "blue",
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





// update the widgets about peers
setInterval(updatePeersWidgets, 1000, screen,
    activePeersLocation,
    activePeersList,
    uploadSparkLine,
    downloadSparkline,
);

// update the transfer info widget
setInterval(updateTransferInfoWidget, 1000, screen, transferSpeedLine);





screen.key(["escape", "q", "C-c"], function (_ch, _key) {
    return process.exit(0);
});

screen.render();