import blessed from "blessed";
import contrib from "blessed-contrib";
import { updateWidgets } from "./widgets.js";
import { Widgets } from "./types.js";


const screen = blessed.screen({});

const gridSize = {
    width: 16,
    height: 9
};

const grid = new contrib.grid({ cols: gridSize.width, rows: gridSize.height, screen: screen });


// widgets
//  grid location is (y, x, heigth, width) which is very confusing
const activePeersLocation: contrib.Widgets.MapElement = grid.set(0, 0, 5, 9, contrib.map, {
    label: "Active Peers - Location"
});

const activePeersList: contrib.Widgets.TableElement = grid.set(5, 0, 4, 9, contrib.table, {
    label: "Active Peers - List",
    keys: true,
    interactive: false,
    columnSpacing: 6,
    columnWidth: [15, 16, 20, 10, 10, 8]
});

const transferSpeedLine: contrib.Widgets.LineElement = grid.set(4, 9, 4, 5, contrib.line, {
    label: "Transfer Speed (MiB/s)",
    showLegend: true,
    showNthLabel: 15,
    legend: { width: 10 },
    wholeNumbersOnly: true
});

const uploadSparkLine: contrib.Widgets.SparklineElement = grid.set(0, 13, 2, 3, contrib.sparkline, {
    label: "Upload Speed",
    tags: true,
    style: {
        fg: "cyan",
        text: "white",
    },
    valign: "middle",
});

const downloadSparkline: contrib.Widgets.SparklineElement = grid.set(2, 13, 2, 3, contrib.sparkline, {
    label: "Download Speed",
    tags: true,
    style: {
        fg: "green",
        text: "white",
    },
    valign: "middle"
});

const activePeersCountriesHist: contrib.Widgets.BarElement = grid.set(0, 9, 4, 4, contrib.bar, {
    label: "Active Peers - Countries",
    barWidth: 3,
    barSpacing: 2,
    xOffset: 3,
    maxHeight: 2
});


const clientsList: blessed.Widgets.BoxElement = grid.set(4, 14, 2, 2, blessed.box, {
    label: "Connected Clients",
    align: "center"
});


const connectionStatusIcon: blessed.Widgets.BoxElement = grid.set(6, 14, 2, 2, blessed.box, {
    label: "Connection Status",
    align: "center"
});


const torrentsInfoBox: blessed.Widgets.BoxElement = grid.set(8, 9, 1, 3, blessed.box, {
    label: "Torrents Info",
    align: "center"
});


const alltimeStatsInfoBox: blessed.Widgets.BoxElement = grid.set(8, 12, 1, 2, blessed.box, {
    label: "Alltime Stats",
    align: "center"
});


const timeBox:blessed.Widgets.BoxElement = grid.set(8, 14, 1, 2, blessed.box, {
    align: "center",
    content: "\n00:00"
})


const widgets: Widgets = {
    activePeersLocation,
    activePeersList,
    activePeersCountriesHist,
    uploadSparkLine,
    downloadSparkline,
    transferSpeedLine,
    clientsList,
    connectionStatusIcon,
    torrentsInfoBox,
    alltimeStatsInfoBox,
    timeBox
}


updateWidgets(screen, widgets);


screen.key(["escape", "q", "C-c"], function (_ch, _key) {
    return process.exit(0);
});