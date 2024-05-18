import { EnhancedPeer } from "./peers.js";
import { IpMap } from "../types.js";
import { fixStringLength, formatBytes } from "../util.js";


const keys = ["IP", "Location", "Torrent", "↓ (B/s)", "↑ (B/s)", "Progress"];


export function updatePeersList(widget: any, peers: EnhancedPeer[], anonymizedIpMap: IpMap): void {
    // sort the peers from most active to least
    peers.sort((a, b) => {
        if (a.downloadSpeed || b.downloadSpeed) return b.downloadSpeed - a.downloadSpeed;
        return b.uploadSpeed - a.uploadSpeed;
    });

    // transform the enhancedpeers to data for in the table
    const data = peers.map((peer) => {
        return [
            anonymizedIpMap[peer.ip],
            `${peer.location.city}, ${peer.location.countryCode}`.substring(0, 20),
            peer.torrent.substring(0, 22),
            fixStringLength(formatBytes(peer.downloadSpeed), 10, true),
            fixStringLength(formatBytes(peer.uploadSpeed), 10, true),
            fixStringLength(`${Math.round(peer.progress * 1000) / 10}%`, 8, true)
        ];
    });

    widget.setData({
        headers: keys,
        data: data
    });
}



