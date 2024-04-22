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

export type Torrent = {
    hash: string;
}

export type TorrentFilter = "active";

export type TorrentPeers = {
    peers: {
        [key: string]: Peer;
    }
}

export type Peer = {
    ip: string;
    dl_speed: number;
    up_speed: number;
}