import lookup from "../iplookup.js";
import qb from "../qbittorrent.js";
import { anonymizeIp } from "../util.js";
import { IpMap, Location, Peer, Torrent } from "../types.js";
import { updatePeersMap } from "./peers/activepeerslocation.js";
import { updatePeersList } from "./peers/activepeerslist.js"
import { updateDownloadSparkLine, updateUploadSparkLine } from "./peers/sparkline.js";
import { updatePeersCountriesHistogram } from "./peers/activepeerscountries.js";



export class EnhancedPeer {
    ip: string;
    torrent: string;
    progress: number;
    downloadSpeed: number;
    uploadSpeed: number;
    location: Location;

    constructor(peer: Peer, torrent: Torrent) {
        this.ip = peer.ip;
        this.torrent = torrent.name;
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



export async function updatePeersWidgets(
    peersMapWidget: any,
    peersListWidget: any,
    uploadSparkLineWidget: any,
    downloadSparkLineWidget: any,
    peersCountriesWidget: any) {

    const peers = await getEnhancedPeers();

    updateAnonymizedIpsMap(peers);

    updatePeersMap(peersMapWidget, peers);
    updatePeersList(peersListWidget, peers, anonymizedIpMap);
    updateUploadSparkLine(uploadSparkLineWidget, peers, anonymizedIpMap);
    updateDownloadSparkLine(downloadSparkLineWidget, peers, anonymizedIpMap);
    updatePeersCountriesHistogram(peersCountriesWidget, peers);
}


async function getEnhancedPeers(): Promise<EnhancedPeer[]> {
    const peers: EnhancedPeer[] = [];

    const activeTorrents = await qb.torrentsInfo("active");

    for (const torrent of activeTorrents) {
        const torrentPeers = (await qb.syncTorrentPeers(torrent.hash)).peers;

        for (const peer in torrentPeers) {
            const torrentPeer = torrentPeers[peer];

            // check if this specific peer is actually downloading or uploading
            if (torrentPeer.up_speed || torrentPeer.dl_speed) {
                const peer = new EnhancedPeer(torrentPeer, torrent);
                peers.push(peer);
            }
        }
    }

    return peers;
}


const anonymizedIpMap: IpMap = {};
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
