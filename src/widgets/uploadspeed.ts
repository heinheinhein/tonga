import blessed from "blessed";
import contrib from "blessed-contrib";
import qb from "../qbittorrent.js"
import { ipToCountryCode, anonymizeIp } from "../iplookup.js";
import { DisplayPeer, PeersSpeed, PeersSpeeds } from "../types.js";


const historicPeersSpeeds: PeersSpeeds = {};
const featuredPeers: DisplayPeer[] = [];


async function updateWidget(widget: any, screen: blessed.Widgets.Screen): Promise<void> {
    const currentSpeeds = await getPeersUploadSpeed();

    // for all the peers that are currently downloading
    for (const peer in currentSpeeds) {

        // if they exists, append their current speed to their historic speeds
        if (peer in historicPeersSpeeds) {
            historicPeersSpeeds[peer].push(currentSpeeds[peer]);
            historicPeersSpeeds[peer].shift();
        } else {
            // if they dont exist yet, add them to the historic peers with an empty array 
            historicPeersSpeeds[peer] = Array(32).fill(0);
            historicPeersSpeeds[peer].push(currentSpeeds[peer]);
            historicPeersSpeeds[peer].shift();
        }
    }

    for (const peer in historicPeersSpeeds) {
        if (!(peer in currentSpeeds)) {
            // add a 0 to the speeds if there is no current speed for this peer
            historicPeersSpeeds[peer].push(0);
            historicPeersSpeeds[peer].shift();

            // delete the peer from historic peers if its speeds are all 0s
            if (historicPeersSpeeds[peer].every(x => x === 0)) delete historicPeersSpeeds[peer];
        }
    }

    // remove peers from featured if they are inactive (the last 5 speeds are 0)
    for (let i = 0; i < featuredPeers.length; i++) {
        const peer = featuredPeers[i];
        if (historicPeersSpeeds[peer.ip].slice(-5).every(speed => speed === 0)) featuredPeers.splice(i, 1);
    }

    // fill the featured peers array if doesnt contain three peers
    const activePeers = Object.keys(currentSpeeds);
    while (featuredPeers.length < 3 && activePeers.length > 2) {
        const peerToFeature = activePeers[Math.round(Math.random() * activePeers.length)];

        if (peerToFeature) {
            featuredPeers.push({
                ip: peerToFeature,
                displayIp: `${anonymizeIp(peerToFeature)} (${ipToCountryCode(peerToFeature)})`
            });
        }
    }


    const peerIps = featuredPeers.map(peer => peer.displayIp),
        peerSpeeds = featuredPeers.map(peer => historicPeersSpeeds[peer.ip]);


    widget.setData(peerIps, peerSpeeds);

    screen.render();
}


async function getPeersUploadSpeed(): Promise<PeersSpeed> {
    const speeds: PeersSpeed = {};

    const activeTorrents = await qb.torrentsInfo("active");

    for (const torrent of activeTorrents) {
        const torrentPeers = (await qb.syncTorrentPeers(torrent.hash)).peers;

        for (const peer in torrentPeers) {
            const torrentPeer = torrentPeers[peer];

            if (!torrentPeer.ip) continue;
            if (torrentPeer.up_speed) speeds[torrentPeer.ip] = torrentPeer.up_speed;
        }
    }

    return speeds;
}


export default {
    widget: contrib.sparkline,
    settings: {
        label: "Upload Speed",
        tags: true,
        style: {
            fg: "blue",
            text: "white",
        }
    },
    startUpdateInterval: (widget: any, screen: blessed.Widgets.Screen) => {
        updateWidget(widget, screen);
        return setInterval(updateWidget, 1000, widget, screen);
    }
}