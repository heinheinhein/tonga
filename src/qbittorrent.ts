import cookie from "cookie";
import { Maindata, TorrentPeers } from "./types.js";



class QBittorrent {

    private url: string;
    private user: string;
    private password: string;
    private sid?: string;


    constructor(url: string, user: string, password: string) {
        if (url.endsWith("/")) url = url.substring(0, url.length - 1);
        this.url = url;
        this.user = user;
        this.password = password;
    }


    private async apiRequest(apiUrl: string, fetchOptions?: RequestInit): Promise<Response> {

        if (!this.sid) throw new Error("No cookie configured, did you use login()?");

        if (!fetchOptions) fetchOptions = {};
        if (!fetchOptions.method) fetchOptions.method = "POST";
        fetchOptions.headers = {
            "cookie": `SID=${this.sid}`
        };

        return fetch(this.url + apiUrl, fetchOptions);
    }


    async login(): Promise<void> {
        const res = await fetch(this.url + "/api/v2/auth/login", {
            method: "POST",
            body: new URLSearchParams({
                username: this.user,
                password: this.password,
            }),
        });

        if (res.status !== 200) throw new Error(`Could not login to qBittorrent: ${res.status} ${res.statusText}`);

        const cookieHeader = res.headers.get("set-cookie");
        if (!cookieHeader) throw new Error("Did not recieve a set-cookie header from qBittorrent");

        const cookies = cookie.parse(cookieHeader);
        if (!cookies.SID) throw new Error("Did not recieve a valid cookie from qBittorrent");
        this.sid = cookies.SID
    }


    async syncMaindata(): Promise<Maindata> {
        const res = await this.apiRequest("/api/v2/sync/maindata");

        if (res.status !== 200) throw new Error(`Could not sync main data: ${res.status} ${res.statusText}`);

        return (await res.json() as Maindata);
    }


    async syncTorrentPeers(hash: string): Promise<TorrentPeers> {
        const res = await this.apiRequest("/api/v2/sync/torrentPeers", {
            body: new URLSearchParams({ hash })
        });

        if (res.status !== 200) throw new Error(`Could not sync torrent peers: ${res.status} ${res.statusText}`);

        return (await res.json() as TorrentPeers);
    }
}




if (process.env.QBITTORRENT_URL === undefined) throw new Error("Environment variable QBITTORRENT_URL is undefined");
if (process.env.QBITTORRENT_USER === undefined) throw new Error("Environment variable QBITTORRENT_USER is undefined");
if (process.env.QBITTORRENT_PASSWORD === undefined) throw new Error("Environment variable QBITTORRENT_PASSWORD is undefined");

const qb = new QBittorrent(process.env.QBITTORRENT_URL, process.env.QBITTORRENT_USER, process.env.QBITTORRENT_PASSWORD);
await qb.login();


export default qb;