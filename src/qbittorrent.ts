import { QBittorrent } from "@ctrl/qbittorrent";

if (process.env.QBITTORRENT_URL === undefined) throw new Error("Environment variable QBITTORRENT_URL is undefined");
if (process.env.QBITTORRENT_USER === undefined) throw new Error("Environment variable QBITTORRENT_USER is undefined");
if (process.env.QBITTORRENT_PASSWORD === undefined) throw new Error("Environment variable QBITTORRENT_PASSWORD is undefined");

const client = new QBittorrent({
    baseUrl: process.env.QBITTORRENT_URL,
    username: process.env.QBITTORRENT_USER,
    password: process.env.QBITTORRENT_PASSWORD
});

export default client;