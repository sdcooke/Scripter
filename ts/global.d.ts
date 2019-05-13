// ------ Parameters

declare interface CheckboxParameter {
    type: "checkbox";
    name: string;
    defaultValue: 0 | 1;
}

declare interface LinearSliderParameter {
    type: "lin";
    name: string;
    defaultValue: number;
}

declare interface MenuParameter {
    type: "menu";
    name: string;
    valueStrings: string[];
}

declare interface MomentaryParameter {
    type: "momentary";
    name: string;
}

declare type Parameter = CheckboxParameter | LinearSliderParameter | MenuParameter | MomentaryParameter;

declare type PluginParametersType = Parameter[];

declare function GetParameter(name: string): number;

declare function SetParameter(name: string, value: number): void;

declare function ParameterChanged(name: number, value: number): void;

// ------ MIDI

declare const enum Note {
    C = "C",
    Db = "Db",
    D = "D",
    Eb = "Eb",
    E = "E",
    F = "F",
    Gb = "Gb",
    G = "G",
    Ab = "Ab",
    A = "A",
    Bb = "Bb",
    B = "B"
}

declare const enum CC {
    Modulation = 1,
    Expression = 11,
    Hold = 64
}

declare const enum Pitch {
    A0 = 21,
    Bb0 = 22,
    B0 = 23,
    C1 = 24,
    Db1 = 25,
    D1 = 26,
    Eb1 = 27,
    E1 = 28,
    F1 = 29,
    Gb1 = 30,
    G1 = 31,
    Ab1 = 32,
    A1 = 33,
    Bb1 = 34,
    B1 = 35,
    C2 = 36,
    Db2 = 37,
    D2 = 38,
    Eb2 = 39,
    E2 = 40,
    F2 = 41,
    Gb2 = 42,
    G2 = 43,
    Ab2 = 44,
    A2 = 45,
    Bb2 = 46,
    B2 = 47,
    C3 = 48,
    Db3 = 49,
    D3 = 50,
    Eb3 = 51,
    E3 = 52,
    F3 = 53,
    Gb3 = 54,
    G3 = 55,
    Ab3 = 56,
    A3 = 57,
    Bb3 = 58,
    B3 = 59,
    C4 = 60,
    Db4 = 61,
    D4 = 62,
    Eb4 = 63,
    E4 = 64,
    F4 = 65,
    Gb4 = 66,
    G4 = 67,
    Ab4 = 68,
    A4 = 69,
    Bb4 = 70,
    B4 = 71,
    C5 = 72,
    Db5 = 73,
    D5 = 74,
    Eb5 = 75,
    E5 = 76,
    F5 = 77,
    Gb5 = 78,
    G5 = 79,
    Ab5 = 80,
    A5 = 81,
    Bb5 = 82,
    B5 = 83,
    C6 = 84,
    Db6 = 85,
    D6 = 86,
    Eb6 = 87,
    E6 = 88,
    F6 = 89,
    Gb6 = 90,
    G6 = 91,
    Ab6 = 92,
    A6 = 93,
    Bb6 = 94,
    B6 = 95,
    C7 = 96,
    Db7 = 97,
    D7 = 98,
    Eb7 = 99,
    E7 = 100,
    F7 = 101,
    Gb7 = 102,
    G7 = 103,
    Ab7 = 104,
    A7 = 105,
    Bb7 = 106,
    B7 = 107,
    C8 = 108
}

declare class MidiEvent {
    send(): void;
}

declare class NoteOn extends MidiEvent {
    pitch: Pitch;
    velocity: number;
}

declare class NoteOff extends MidiEvent {
    pitch: Pitch;
    velocity: number;
}

declare class ControlChange extends MidiEvent {
    number: number;
    value: number;
}

// ------ Plugin

declare interface ScripterPlugin {
    PluginParameters?: PluginParametersType;
    HandleMIDI?: (event: MidiEvent) => void;
    Reset?: () => void;
    ParameterChanged?: (param: number, value: number) => void;
}
