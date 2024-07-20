import contrib from "blessed-contrib";
import { EnhancedPeer } from "../peers.js";
import { IpMap } from "../../types.js";
import { fixStringLength, formatBytes, substringWithEllipsis } from "../../util.js";
import chalk from "chalk";


const keys = ["IP", "Location", "Torrent", "↓ (B/s)", "↑ (B/s)", "Progress"]
    .map((key) => chalk.inverse(key));

export function updatePeersList(widget: contrib.Widgets.TableElement, peers: EnhancedPeer[], anonymizedIpMap: IpMap): void {
    // sort the peers from most active to least
    peers.sort((a, b) => {
        if (a.downloadSpeed || b.downloadSpeed) return b.downloadSpeed - a.downloadSpeed;
        return b.uploadSpeed - a.uploadSpeed;
    });


    // display only 18 peers
    peers.splice(18);


    // transform the enhancedpeers to data for in the table
    const data = peers.map((peer) => {
        return [
            anonymizedIpMap[peer.ip],
            substringWithEllipsis(`${peer.location.city}, ${peer.location.countryCode}`, 16),
            substringWithEllipsis(peer.torrent, 20),
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