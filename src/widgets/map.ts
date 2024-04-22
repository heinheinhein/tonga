import blessed from "blessed";
import contrib from "blessed-contrib";
import qb from "../qbittorrent.js"
import lookup from "../iplookup.js";
import { MapMarker, Peer } from "../types.js";


async function updateMap(mapWidget: any, screen: blessed.Widgets.Screen): Promise<void> {
    const markers = await getMarkers();

    mapWidget.clearMarkers();

    for (const marker of markers) {
        mapWidget.addMarker(marker)
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
    const location = lookup.get(peer.ip);

    if (!location) return false;

    const lon = location.location?.longitude;
    if (!lon) return false;
    const lat = location.location?.latitude;
    if (!lat) return false;

    return {
        lon: lon.toString(),
        lat: lat.toString(),
        color: "white",
        char
    }
}



export default {
    widget: contrib.map,
    settings: {
        label: "Active Peers"
    },
    startUpdateInterval: (mapWidget: any, screen: blessed.Widgets.Screen) => {
        updateMap(mapWidget, screen);
        return setInterval(updateMap, 5000, mapWidget, screen);
    }
}