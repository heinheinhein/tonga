export type MapMarker = {
    "lon": string;
    "lat": string;
    color: TerminalColor;
    char: string;
};

type TerminalColor = "black" |
    "red" |
    "green" |
    "yellow" |
    "blue" |
    "magenta" |
    "cyan" |
    "white";