import blessed from "blessed";
import contrib from "blessed-contrib";
import qb from "../qbittorrent.js";
import { ListPeer } from "../types.js";
import { anonymizeIp, ipToCityCountryCode } from "../iplookup.js";


const keys = ["IP", "Location", "Torrent", "↓ (B/s)", "↑ (B/s)", "Progress"];
const anonymizedIpMap: { [key: string]: string } = {};

async function updateWidget(widget: any, screen: blessed.Widgets.Screen): Promise<void> {

    const peers = await getListPeers();

    // save the anonymized ip in the anonymizedIpMap if it doesnt exist yet 
    for (let i = 0; i < peers.length; i++) {
        const peer = peers[i];
        if (!(peer.ip in anonymizedIpMap)) anonymizedIpMap[peer.ip] = anonymizeIp(peer.ip);
    }

    // remove old ips from anonymizedIpMap if they are not peers anymore
    const activePeers = peers.map(peer => peer.ip);
    for (const ip in anonymizedIpMap) {
        if (!activePeers.includes(ip)) delete anonymizedIpMap[ip];
    }


    // sort the peers from most active to least
    peers.sort((a, b) => {
        if (a.downloadSpeed || b.downloadSpeed) return b.downloadSpeed - a.downloadSpeed;
        return b.uploadSpeed - a.uploadSpeed;
    });


    // TODO show up and download speed in kb/mb dependent on speed
    const data = peers.map(peer => {
        return [
            anonymizedIpMap[peer.ip],
            peer.location.substring(0, 20),
            peer.torrent.substring(0, 22),
            formatBytes(peer.downloadSpeed),
            formatBytes(peer.uploadSpeed),
            fixedLenghtString(`${Math.round(peer.progress * 1000) / 10}%`, 8)
        ];
    });

    widget.setData({
        headers: keys,
        data: data
    });


    screen.render();
}


async function getListPeers(): Promise<ListPeer[]> {
    const peers: ListPeer[] = [];

    const activeTorrents = await qb.torrentsInfo("active");

    for (const torrent of activeTorrents) {
        const torrentPeers = (await qb.syncTorrentPeers(torrent.hash)).peers;

        for (const peer in torrentPeers) {
            const torrentPeer = torrentPeers[peer];

            if (!torrentPeer.ip) continue;
            if (torrentPeer.up_speed || torrentPeer.dl_speed) peers.push({
                ip: torrentPeer.ip,
                location: ipToCityCountryCode(torrentPeer.ip),
                torrent: torrent.name,
                progress: torrentPeer.progress,
                downloadSpeed: torrentPeer.dl_speed,
                uploadSpeed: torrentPeer.up_speed
            });
        }
    }

    return peers;
}


function formatBytes(bytes: number) {
    if (!+bytes) return fixedLenghtString("0 B", 9);

    const k = 1024;
    const decimals = 1;
    const sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return fixedLenghtString(`${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`, 9);
}

function fixedLenghtString(string: string, length: number) {
    if (length - string.length < 1) return string;

    string = " ".repeat(length - string.length) + string;

    return string;
}


export default {
    widget: contrib.table,
    settings: {
        label: "Active Peers",
        keys: true,
        interactive: false,
        columnSpacing: 6,
        columnWidth: [15, 20, 22, 10, 10, 8],
    },
    startUpdateInterval: (widget: any, screen: blessed.Widgets.Screen) => {
        updateWidget(widget, screen);
        return setInterval(updateWidget, 2000, widget, screen);
    }
}