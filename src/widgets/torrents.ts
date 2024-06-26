import chalk from "chalk";
import { Torrents, TorrentsWidgets } from "../types.js";
import { fixStringLength } from "../util.js";



export function updateTorrentsWidgets(torrents: Torrents, widgets: TorrentsWidgets): void {

    const torrentHashes = Object.keys(torrents);
    const torrentsArray = torrentHashes.map((hash) => torrents[hash]);

    const boxWidth = 14;
    const divider = "    ";

    const numberOfTorrents = `${chalk.green("Torrents")} ${fixStringLength(torrentHashes.length.toString(), boxWidth - 9, true)}`;



    const activeTorrents = torrentsArray.filter((torrent) => torrent.state === "uploading" || torrent.state === "downloading");
    const numberOfActiveTorrents = `${chalk.green("Active")} ${fixStringLength(activeTorrents.length.toString(), boxWidth - 7, true)}`;

    const downloadingTorrents = torrentsArray.filter((torrent) => torrent.state === "downloading");
    const numberOfDownloadingTorrents = `${chalk.green("Downloading")} ${fixStringLength(downloadingTorrents.length.toString(), boxWidth - 12, true)}`;

    const uploadingTorrents = torrentsArray.filter((torrent) => torrent.state === "uploading");
    const numberOfUploadingTorrents = `${chalk.green("Uploading")} ${fixStringLength(uploadingTorrents.length.toString(), boxWidth - 10, true)}`;

    const queuedTorrents = torrentsArray.filter((torrent) => torrent.state === "queuedDL" || torrent.state === "queuedUP");
    const numberOfQueuedTorrents = `${chalk.green("Queued")} ${fixStringLength(queuedTorrents.length.toString(), boxWidth - 7, true)}`;

    const pausedTorrents = torrentsArray.filter((torrent) => torrent.state === "pausedDL" || torrent.state === "pausedUP");
    const numberOfPausedTorrents = `${chalk.green("Paused")} ${fixStringLength(pausedTorrents.length.toString(), boxWidth - 7, true)}`;

    
    
    const row1 = numberOfTorrents + divider + numberOfDownloadingTorrents;
    const row2 = numberOfActiveTorrents + divider + numberOfUploadingTorrents;
    const row3 = numberOfQueuedTorrents + divider + numberOfPausedTorrents;


    const content = row1 + "\n" + row2 + "\n" + row3;

    widgets.torrentsInfoBox.setContent(content);
}