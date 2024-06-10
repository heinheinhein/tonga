import { LineSeries, TransferInfo } from "../../types.js";

const xAxisLength = 31;
const xAxis = Array(xAxisLength).fill(0).map((_value, index) => (xAxisLength - index - 1).toString());


const downloadSeries: LineSeries = {
    title: "download",
    x: xAxis,
    y: Array(xAxis.length).fill(0),
    style: { line: "green" }
},
    uploadSeries: LineSeries = {
        title: "upload",
        x: xAxis,
        y: Array(xAxis.length).fill(0),
        style: { line: "cyan" }
    }


export function updateTransferSpeedLine(widget: any, transferInfo: TransferInfo): void {
    downloadSeries.y.push(transferInfo.dl_info_speed / 1024 / 1024);
    downloadSeries.y.shift();
    uploadSeries.y.push(transferInfo.up_info_speed / 1024 / 1024);
    uploadSeries.y.shift();

    widget.setData([downloadSeries, uploadSeries]);
}