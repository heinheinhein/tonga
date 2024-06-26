import contrib from "blessed-contrib";
import { EnhancedPeer } from "../peers.js";
import { MapMarker } from "../../types.js";


export function updatePeersWorldMap(widget: contrib.Widgets.MapElement, peers: EnhancedPeer[]): void {
    const markers = peersToMarkers(peers);

    //@ts-ignore: this function does actually exist on MapElement type
    widget.clearMarkers();

    for (let i = 0; i < markers.length; i++) {
        //@ts-ignore: this function also exists
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
