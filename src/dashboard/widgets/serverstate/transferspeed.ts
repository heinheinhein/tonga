import contrib from "blessed-contrib";
import { LineSeries, ServerState } from "../../types.js";

const xAxisLength = 46;
const xAxis = Array(xAxisLength - 1).fill(0).map((_value, index) => {
    return "-" + Math.round((xAxisLength - index - 1) * (2 / 3));
});


const downloadSeries: LineSeries = {
    title: "download",
    x: xAxis,
    y: Array(xAxis.length).fill(0),
    style: { line: "green" }
};
const uploadSeries: LineSeries = {
    title: "upload",
    x: xAxis,
    y: Array(xAxis.length).fill(0),
    style: { line: "cyan" }
};


export function updateTransferSpeedLine(widget: contrib.Widgets.MapElement, serverState: ServerState): void {
    downloadSeries.y.push(serverState.dl_info_speed / 1024 / 1024);
    downloadSeries.y.shift();
    uploadSeries.y.push(serverState.up_info_speed / 1024 / 1024);
    uploadSeries.y.shift();

    widget.setData([downloadSeries, uploadSeries]);
}