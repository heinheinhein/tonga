import blessed from "blessed";
import contrib from "blessed-contrib";


// qBittorrent //

export type Maindata = {
    server_state: ServerState;
    torrents: Torrents;
};

export type ServerState = {
    alltime_dl: number;
    alltime_ul: number;
    connection_status: "connected" | "firewalled" | "disconnected";
    dht_nodes: number;
    dl_info_speed: number;
    up_info_speed: number;
    global_ratio: string;
    total_peer_connections: number;
    refresh_interval: number;
};

export type Torrents = {
    [hash: string]: {
        name: string;
        dlspeed: number;
        upspeed: number;
        state: "error" | "missingFiles" | "uploading" | "pausedUP" | "queuedUP" | "stalledUP" | "checkingUP" | "forcedUP" | "allocating" |
        "downloading" | "metaDL" | "pausedDL" | "queuedDL" | "stalledDL" | "checkingDL" | "forcedDL" | "checkingResumeData" | "moving" | "unknown";
    }
};

export type TorrentPeers = {
    peers: {
        [key: string]: Peer;
    }
};

export type Peer = {
    ip: string;
    client: string;
    dl_speed: number;
    up_speed: number;
    progress: number;
};

// /qBittorrent //


export type Widgets = {
    activePeersLocation: contrib.Widgets.MapElement;
    activePeersList: contrib.Widgets.TableElement;
    activePeersCountriesHist: contrib.Widgets.BarElement;
    uploadSparkLine: contrib.Widgets.SparklineElement;
    downloadSparkline: contrib.Widgets.SparklineElement;
    transferSpeedLine: contrib.Widgets.LineElement;
    clientsList: blessed.Widgets.BoxElement;
    connectionStatusIcon: blessed.Widgets.BoxElement;
    torrentsInfoBox: blessed.Widgets.BoxElement;
    alltimeStatsInfoBox: blessed.Widgets.BoxElement;
    timeBox: blessed.Widgets.BoxElement;
};

export type PeersWidgets = {
    activePeersLocation: contrib.Widgets.MapElement;
    activePeersList: contrib.Widgets.TableElement;
    activePeersCountriesHist: contrib.Widgets.BarElement;
    uploadSparkLine: contrib.Widgets.SparklineElement;
    downloadSparkline: contrib.Widgets.SparklineElement;
    clientsList: blessed.Widgets.BoxElement;
};

export type ServerStateWidgets = {
    transferSpeedLine: contrib.Widgets.LineElement;
    connectionStatusIcon: blessed.Widgets.BoxElement;
    alltimeStatsInfoBox: blessed.Widgets.BoxElement;
};

export type TorrentsWidgets = {
    torrentsInfoBox: blessed.Widgets.BoxElement;
};

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