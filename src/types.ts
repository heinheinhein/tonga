// qBittorrent //

export type Torrent = {
    hash: string;
    name: string;
};

export type TorrentFilter = "active";

export type TorrentPeers = {
    peers: {
        [key: string]: Peer;
    }
};

export type Peer = {
    ip: string;
    dl_speed: number;
    up_speed: number;
    progress: number;
};

export type TransferInfo = {
    dl_info_speed: number;
    up_info_speed: number;
    // dl_rate_limit: number;
    // up_rate_limit: number;
    // connection_status: "connected" | "firewalled" | "disconnected";
};

// /qBittorrent //


export type MapMarker = {
    lon: string;
    lat: string;
    color: string;
    char: string;
};

export type PeersSpeeds = {
    [key: string]: number[];
};

export type LineSeries = {
    title: string;
    x: string[];
    y: number[];
    style?: { line: string }
};

export type Location = {
    country: string;
    countryCode: string;
    city: string;
    latitude: number;
    longitude: number;
};

export type IpMap = {
    [key: string]: string;
};