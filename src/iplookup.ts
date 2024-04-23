import maxmind, { CityResponse } from "maxmind";
import { Location } from "./types.js";

const lookup = await maxmind.open<CityResponse>("./GeoLite2-City/GeoLite2-City.mmdb");

export default lookup;


export function anonymizeIp(ip: string) {
    // pretend ipv6 does not exist

    let splitIp: string[] = ip.split(".");
    if (splitIp.length !== 4) return "192.0.2.*";

    // randomize the amount of stars used for the last octet
    const randomOctet = Math.round(Math.random() * 253) + 1;
    splitIp[3] = randomOctet.toString().replace(/\d/g, "*");

    ip = splitIp.join(".");
    return ip;
}


export function ipToCountryCode(ip: string): string {
    const location = lookup.get(ip);
    return location?.country?.iso_code || "XX";
}


export function ipToCoordinates(ip: string): Location {
    const location = lookup.get(ip);
    const lon = location?.location?.longitude;
    const lat = location?.location?.latitude;

    if (lon && lat) return { lon, lat };
    return { lon: 0, lat: 0 };
}

export function ipToCityCountryCode(ip: string): string {
    const location = lookup.get(ip);

    const city = location?.city?.names.en || "unknown";
    const country = location?.country?.iso_code || "XX";

    return `${city} (${country})`;
}