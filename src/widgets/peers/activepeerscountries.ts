import { EnhancedPeer } from "../peers.js";

export function updatePeersCountriesHistogram(widget: any, peers: EnhancedPeer[]): void {

    const countriesCount: { [key: string]: number } = {};

    for (let i = 0; i < peers.length; i++) {
        const peer = peers[i];

        if (!(peer.location.countryCode in countriesCount)) countriesCount[peer.location.countryCode] = 0;
        countriesCount[peer.location.countryCode]++;
    }

    let countries = Object.keys(countriesCount).map(countryCode => {
        return {
            countryCode,
            value: countriesCount[countryCode]
        }
    });

    countries.sort((a, b) => b.value - a.value);

    countries = countries.slice(0, 10);

    widget.setData({
        titles: countries.map(country => country.countryCode),
        data: countries.map(country => country.value)
    });
}