import blessed from "blessed";
import contrib from "blessed-contrib";
import qb from "../qbittorrent.js"
import { ipToCoordinates } from "../iplookup.js";
import { MapMarker, Peer } from "../types.js";


async function updateWidget(widget: any, screen: blessed.Widgets.Screen): Promise<void> {
    const markers = await getMarkers();

    widget.clearMarkers();

    for (const marker of markers) {
        widget.addMarker(marker)
    };

    screen.render();
}

async function getMarkers(): Promise<MapMarker[]> {
    const markers: MapMarker[] = [];

    const activeTorrents = await qb.torrentsInfo("active");

    for (const torrent of activeTorrents) {
        const torrentPeers = (await qb.syncTorrentPeers(torrent.hash)).peers;

        for (const peer in torrentPeers) {
            const torrentPeer = torrentPeers[peer];

            if (!torrentPeer.ip) continue;

            // check if this specific peer is actually downloading or uploading
            if (torrentPeer.up_speed || torrentPeer.dl_speed) {
                const marker = peerToMarker(torrentPeer);
                if (marker) markers.push(marker);
            }
        }
    }

    return markers;
}

// returns false if peer doesn't have a location
function peerToMarker(peer: Peer): MapMarker | false {

    const char = peer.dl_speed ? "▽" : "△";

    if (!peer.ip) return false;
    const location = ipToCoordinates(peer.ip);

    return {
        lon: location.lon.toString(),
        lat: location.lat.toString(),
        color: "white",
        char
    }
}



export default {
    widget: contrib.map,
    settings: {
        label: "Active Peers"
    },
    startUpdateInterval: (widget: any, screen: blessed.Widgets.Screen) => {
        updateWidget(widget, screen);
        return setInterval(updateWidget, 5000, widget, screen);
    }
}