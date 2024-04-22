import blessed from "blessed";
import contrib from "blessed-contrib";
import map from "./widgets/map.js";


const screen = blessed.screen({
});

const gridSize = {
    height: 9,
    width: 12
}
const grid = new contrib.grid({ cols: gridSize.width, rows: gridSize.height, screen: screen });


// set the grid components
// grid.set(Y, X, height, width, widget, settings);
const gridMap = grid.set(0, 0, 5, 9, map.widget, map.settings);


// for the dynamic elements in the grid, we need to update them periodically
map.startUpdateInterval(gridMap, screen)


screen.key(["escape", "q", "C-c"], function (_ch, _key) {
    return process.exit(0);
});

screen.render();