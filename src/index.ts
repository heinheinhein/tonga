import blessed from "blessed";
import contrib from "blessed-contrib";
import peersLocation from "./widgets/peerslocation.js";
import uploadSpeed from "./widgets/uploadspeed.js";
import peersList from "./widgets/peerslist.js"


const screen = blessed.screen({
});

const gridSize = {
    height: 9,
    width: 12
};
const grid = new contrib.grid({ cols: gridSize.width, rows: gridSize.height, screen: screen });


// set the grid components
// grid.set(Y, X, height, width, widget, settings);
const gridMap = grid.set(0, 0, 5, 9, peersLocation.widget, peersLocation.settings);
const gridSparkLine = grid.set(0, 9, 2, 3, uploadSpeed.widget, uploadSpeed.settings);
const gridTable = grid.set(5, 0, 4, 12, peersList.widget, peersList.settings);


// for the dynamic elements in the grid, we need to update them periodically
peersLocation.startUpdateInterval(gridMap, screen);
uploadSpeed.startUpdateInterval(gridSparkLine, screen);
peersList.startUpdateInterval(gridTable, screen);


screen.key(["escape", "q", "C-c"], function (_ch, _key) {
    return process.exit(0);
});

screen.render();