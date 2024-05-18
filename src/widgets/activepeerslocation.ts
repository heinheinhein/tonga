import { EnhancedPeer } from "./peers.js";
import { MapMarker } from "../types.js";


export function updatePeersMap(widget: any, peers: EnhancedPeer[]): void {
    const markers = peersToMarkers(peers);

    widget.clearMarkers();

    for (let i = 0; i < markers.length; i++) {
        widget.addMarker(markers[i]);
    }
}


function peersToMarkers(peers: EnhancedPeer[]): MapMarker[] {

    return peers.map((peer) => {
        return {
            lat: peer.location.latitude.toString(),
            lon: peer.location.longitude.toString(),
            color: "white",
            char: peer.downloadSpeed ? "▽" : "△"
        }
    });
}
