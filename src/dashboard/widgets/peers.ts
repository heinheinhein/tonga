import lookup from "../iplookup.js";
import qb from "../qbittorrent.js";
import { IpMap, Location, Peer, PeersWidgets, Torrents } from "../types.js";
import { anonymizeIp } from "../util.js";
import { updatePeersCountriesHistogram } from "./peers/activepeerscountries.js";
import { updatePeersList } from "./peers/activepeerslist.js";
import { updatePeersWorldMap } from "./peers/activepeerslocation.js";
import { updateClientsList } from "./peers/clients.js";
import { updateDownloadSparkLine, updateUploadSparkLine } from "./peers/sparkline.js";

export class EnhancedPeer {
    ip: string;
    client: string;
    torrent: string;
    progress: number;
    downloadSpeed: number;
    uploadSpeed: number;
    location: Location;

    constructor(peer: Peer, torrentName: string) {
        this.ip = peer.ip;
        this.client = peer.client;
        this.torrent = torrentName;
        this.progress = peer.progress;
        this.downloadSpeed = peer.dl_speed;
        this.uploadSpeed = peer.up_speed;

        const location = lookup.get(peer.ip);
        this.location = {
            country: location?.country?.names?.en ? location.country.names.en : "unknown",
            countryCode: location?.country?.iso_code ? location.country.iso_code : "XX",
            city: location?.city?.names.en ? location.city.names.en : "unknown",
            latitude: location?.location?.latitude ? location.location.latitude : 0,
            longitude: location?.location?.longitude ? location.location.longitude : 0
        };
    }
}


const anonymizedIpMap: IpMap = {};


export async function updatePeersWidgets(torrents: Torrents, widgets: PeersWidgets): Promise<void> {

    const peers = await getEnhancedPeers(torrents);

    updateAnonymizedIpsMap(peers);

    updatePeersWorldMap(widgets.activePeersLocation, peers);
    updatePeersList(widgets.activePeersList, peers, anonymizedIpMap);
    updateUploadSparkLine(widgets.uploadSparkLine, peers, anonymizedIpMap);
    updateDownloadSparkLine(widgets.downloadSparkline, peers, anonymizedIpMap);
    updatePeersCountriesHistogram(widgets.activePeersCountriesHist, peers);
    updateClientsList(widgets.clientsList, peers)
}


async function getEnhancedPeers(torrents: Torrents): Promise<EnhancedPeer[]> {
    const peers: EnhancedPeer[] = [];

    const activeTorrentsHashes = Object.keys(torrents).filter((hash) => torrents[hash].upspeed || torrents[hash].dlspeed);

    for (const torrentHash of activeTorrentsHashes) {
        const torrentPeers = (await qb.syncTorrentPeers(torrentHash)).peers;

        for (const peer in torrentPeers) {
            const torrentPeer = torrentPeers[peer];

            // check if this specific peer is actually downloading or uploading
            if (torrentPeer.up_speed || torrentPeer.dl_speed) {
                const peer = new EnhancedPeer(torrentPeer, process.env.DISPLAY_TORRENT_HASHES === "true" ? torrentHash : torrents[torrentHash].name);
                peers.push(peer);
            }
        }
    }

    return peers;
}


function updateAnonymizedIpsMap(peers: EnhancedPeer[]): void {
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
}
