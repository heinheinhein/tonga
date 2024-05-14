import blessed from "blessed";
import contrib from "blessed-contrib";
import peersLocation from "./widgets/peerslocation.js";
import peersList from "./widgets/peerslist.js"
import uploadSpeed from "./widgets/uploadspeed.js";
import transferInfo from "./widgets/transferinfo.js";

const screen = blessed.screen({
});

const gridSize = {
    width: 16,
    height: 9
};
const grid = new contrib.grid({ cols: gridSize.width, rows: gridSize.height, screen: screen });


// set the grid components
// grid.set(Y, X, height, width, widget, settings);
const gridMap = grid.set(0, 0, 5, 9, peersLocation.widget, peersLocation.settings);
const gridTable = grid.set(5, 0, 4, 9, peersList.widget, peersList.settings);
const gridSparkLine = grid.set(4, 9, 2, 3, uploadSpeed.widget, uploadSpeed.settings);
const gridLine = grid.set(0, 9, 4, 7, transferInfo.widget, transferInfo.settings);


// for the dynamic elements in the grid, we need to update them periodically
peersLocation.startUpdateInterval(gridMap, screen);
uploadSpeed.startUpdateInterval(gridSparkLine, screen);
peersList.startUpdateInterval(gridTable, screen);
transferInfo.startUpdateInterval(gridLine, screen);


screen.key(["escape", "q", "C-c"], function (_ch, _key) {
    return process.exit(0);
});

screen.render();