/**
 * Replace the last octect of an IPv4 address with asterisks
 * @param ip IPv4 address
 * @returns Anonymized IP address like `192.0.2.*`
 */
export function anonymizeIp(ip: string): string {
    // pretend ipv6 does not exist

    let splitIp: string[] = ip.split(".");
    if (splitIp.length !== 4) return "192.0.2.*";

    // randomize the amount of stars used for the last octet
    const randomOctet = Math.round(Math.random() * 253) + 1;
    splitIp[3] = randomOctet.toString().replace(/\d/g, "*");

    ip = splitIp.join(".");
    return ip;
}

/**
 * Format a number in bytes to a readable format with 1 decimal
 * @param bytes Number in bytes to be formatted
 * @returns Formatted bytes in a format similar to `123.4 MiB`
 */
export function formatBytes(bytes: number): string {
    if (!+bytes) return "0 B";

    const k = 1024;
    const decimals = 1;
    const sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Convert a string to a fixed length by prepending or appending spaces to the string
 * @param string String to be formatted to a fixed length
 * @param length Length for the string to be fixed to, does not concat the string if the length is shorter than string
 * @param prepend True if the spaces need to be in front of the fixed string
 * @returns String with a fixed length
 */
export function fixStringLength(string: string, length: number, prepend?: boolean): string {
    if (length - string.length < 1) return string;

    string = prepend ? " ".repeat(length - string.length) + string : string + " ".repeat(length - string.length);

    return string;
}

/**
 * Substring while appending ellipsis if text is removed
 * @param string String to be substringed
 * @param length Desired length of the string
 * @returns String with ellipsis appended if text is removed
 */
export function substringWithEllipsis(string: string, length: number): string {
    return string.length > length ? string.substring(0, length - 1) + "…" : string;
}