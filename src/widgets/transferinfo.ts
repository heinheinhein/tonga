import blessed from "blessed";
import contrib from "blessed-contrib";
import qb from "../qbittorrent.js";
import { LineSeries } from "../types.js";


const xLength = 31;
const xAxes = Array(xLength).fill(0).map((_value, index) => (xLength - index - 1).toString());


const downloadSeries: LineSeries = {
    title: "download",
    x: xAxes,
    y: Array(xLength).fill(0),
    style: { line: "green" }
},
    uploadSeries: LineSeries = {
        title: "upload",
        x: xAxes,
        y: Array(xLength).fill(0),
        style: { line: "cyan" }
    }

async function updateWidget(widget: any, screen: blessed.Widgets.Screen): Promise<void> {
    const transferInfo = await qb.transferInfo();

    downloadSeries.y.push(transferInfo.dl_info_speed / 1024 / 1024);
    downloadSeries.y.shift();
    uploadSeries.y.push(transferInfo.up_info_speed / 1024 / 1024);
    uploadSeries.y.shift();

    widget.setData([downloadSeries, uploadSeries]);

    screen.render();
}

export default {
    widget: contrib.line,
    settings: {
        label: "Transfer Speed (MiB/s)",
        showLegend: true,
        showNthLabel: 10
    },
    startUpdateInterval: (widget: any, screen: blessed.Widgets.Screen) => {
        updateWidget(widget, screen);
        return setInterval(updateWidget, 1000, widget, screen);
    }
}