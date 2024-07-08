import maxmind, { CityResponse } from "maxmind";

const lookup = await maxmind.open<CityResponse>("./GeoLite2-City/GeoLite2-City.mmdb");

export default lookup;