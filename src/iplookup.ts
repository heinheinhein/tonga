import maxmind, { CityResponse } from "maxmind";

const lookup = await maxmind.open<CityResponse>("./GeoLite2-City/GeoLite2-City.mmdb");

export default lookup;


export function anonymizeIp(ip: string) {
    // pretend ipv6 does not exist

    const splitIp: string[] = ip.split(".");

    // randomize the amount of stars used for the last octet
    const randomOctet = Math.round(Math.random() * 253) + 1 + "";
    splitIp[3] = randomOctet.replace(/\d/g, "*");

    ip = splitIp.join(".");
    return ip;
}