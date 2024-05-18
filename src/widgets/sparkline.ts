import { EnhancedPeer } from "./peers.js";
import { IpMap, PeersSpeeds } from "../types.js";


let historicUploadSpeeds: PeersSpeeds = {};
let featuredUploads: string[] = [];
let historicDownloadSpeeds: PeersSpeeds = {};
let featuredDownloads: string[] = [];

const yAxisLength = 37;


export function updateUploadSparkLine(widget: any, peers: EnhancedPeer[], anonymizedIpMap: IpMap): void {

    const uploadingPeers = peers.filter(peer => peer.uploadSpeed);

    // add new peers to the historic uploads
    historicUploadSpeeds = addNewPeers(uploadingPeers, historicUploadSpeeds, "uploadSpeed");

    // remove peers which have not been active from the historic uploads
    historicUploadSpeeds = removeInactivePeers(uploadingPeers, historicUploadSpeeds);

    // determine which peers to feature, if there are not enough featured
    featuredUploads = determineFeaturedPeers(uploadingPeers, featuredUploads, historicUploadSpeeds);


    // set the data in the widget
    const featuredUploadIps = featuredUploads.map(ip => anonymizedIpMap[ip]),
        featuredUploadSpeeds = featuredUploads.map(peer => historicUploadSpeeds[peer]);

    widget.setData(featuredUploadIps, featuredUploadSpeeds);

    if (featuredUploads.length === 0) {
        widget.align = "center";
        widget.style.fg = "white";
        widget.content = "Not uploading anything…";
    } else {
        widget.align = "left";
        widget.style.fg = "blue";
    }
}


export function updateDownloadSparkLine(widget: any, peers: EnhancedPeer[], anonymizedIpMap: IpMap): void {

    const downloadingPeers = peers.filter(peer => peer.downloadSpeed);

    // add new peers to the historic downloads
    historicDownloadSpeeds = addNewPeers(downloadingPeers, historicDownloadSpeeds, "downloadSpeed");

    // remove peers which have not been active from the historic downloads
    historicDownloadSpeeds = removeInactivePeers(downloadingPeers, historicDownloadSpeeds);

    // determine which peers to feature, if there are not enough featured
    featuredDownloads = determineFeaturedPeers(downloadingPeers, featuredDownloads, historicDownloadSpeeds);


    // set the data in the widget
    const featuredDownloadIps = featuredDownloads.map(ip => anonymizedIpMap[ip]),
        featuredDownloadSpeeds = featuredDownloads.map(peer => historicDownloadSpeeds[peer]);

    widget.setData(featuredDownloadIps, featuredDownloadSpeeds);

    if (featuredDownloads.length === 0) {
        widget.align = "center";
        widget.style.fg = "white";
        widget.content = "Not downloading anything…";
    } else {
        widget.align = "left";
        widget.style.fg = "green";
    }
}


function addNewPeers(peers: EnhancedPeer[], historicSpeeds: PeersSpeeds, speedProperty: "uploadSpeed" | "downloadSpeed"): PeersSpeeds {
    for (let i = 0; i < peers.length; i++) {
        const peer = peers[i];

        // if the peer does not exist in historicspeeds, create an entry
        if (!(peer.ip in historicSpeeds)) historicSpeeds[peer.ip] = Array(yAxisLength).fill(0);

        // append the latest speed to the array and shift the array
        historicSpeeds[peer.ip].push(peer[speedProperty]);
        historicSpeeds[peer.ip].shift();
    }

    return historicSpeeds;
}

function removeInactivePeers(peers: EnhancedPeer[], historicSpeeds: PeersSpeeds): PeersSpeeds {
    for (const peerIp in historicSpeeds) {
        if (!(peers.map(enhancedPeer => enhancedPeer.ip).includes(peerIp))) {
            // add a 0 to the speeds if there is no current speed for this peer
            historicSpeeds[peerIp].push(0);
            historicSpeeds[peerIp].shift();

            // delete the peer from historic peers if its speeds are all 0s
            if (historicSpeeds[peerIp].every(x => x === 0)) delete historicSpeeds[peerIp];
        }
    }

    return historicSpeeds;
}

function determineFeaturedPeers(peers: EnhancedPeer[], featuredPeers: string[], historicSpeeds: PeersSpeeds): string[] {
    // remove peers from featured if they are inactive (the last speed is 0)
    for (let i = 0; i < featuredPeers.length; i++) {
        const peer = featuredPeers[i];
        if (historicSpeeds[peer][yAxisLength - 1] === 0) featuredPeers.splice(i, 1);
    }

    // fill the featured peers array if doesnt contain three peers
    while (featuredPeers.length < 3 && peers.length > featuredPeers.length) {

        const notFeaturedPeers = peers.filter(peer => !featuredPeers.includes(peer.ip));
        const peerToFeature = notFeaturedPeers[0];

        featuredPeers.push(peerToFeature.ip);
    }

    return featuredPeers;
}