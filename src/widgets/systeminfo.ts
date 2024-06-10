import chalk from "chalk";
import qb from "../qbittorrent.js";
import { fixStringLength } from "../util.js";


export async function updateSystemInfoWidget(systemInfoWidget: any): Promise<void> {
    const version = await qb.appVersion();
    const apiVersion = "v" + await qb.appWebapiVersion();
    const dhtNodes = (await qb.transferInfo()).dht_nodes;

    const content =
        `${chalk.green("qBit:")}      ${chalk.whiteBright(fixStringLength(version, 10, true))}\n` +
        `${chalk.green("API:")}       ${chalk.whiteBright(fixStringLength(apiVersion, 10, true))}\n` +
        `${chalk.green("DHT nodes:")} ${chalk.whiteBright(fixStringLength(dhtNodes.toString(), 10, true))}`;

    systemInfoWidget.setContent(content);
}