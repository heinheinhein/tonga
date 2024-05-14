export type MapMarker = {
    lon: string;
    lat: string;
    color: TerminalColor;
    char: string;
};

export type TerminalColor = "black" |
    "red" |
    "green" |
    "yellow" |
    "blue" |
    "magenta" |
    "cyan" |
    "white";

export type Location = {
    lon: number;
    lat: number;
};

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

export type PeersSpeed = {
    [key: string]: number;
};

export type PeersSpeeds = {
    [key: string]: number[];
};

export type DisplayPeer = {
    ip: string;
    displayIp: string;
};

export type ListPeer = {
    ip: string;
    location: string;
    torrent: string;
    progress: number;
    downloadSpeed: number;
    uploadSpeed: number;
};

export type LineSeries = {
    title: string;
    x: string[];
    y: number[];
    style?: { line: string }
}