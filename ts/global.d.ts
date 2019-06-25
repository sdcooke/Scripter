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
    unit?: string;
    numberOfSteps?: number;
    minValue?: number;
    maxValue?: number;
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

declare interface TargetParameter {
    type: "target";
    name: string;
}

declare type Parameter =
    | CheckboxParameter
    | LinearSliderParameter
    | MenuParameter
    | MomentaryParameter
    | TargetParameter;

declare type PluginParametersType = Parameter[];

declare function GetParameter(name: string): number;

declare function SetParameter(name: string, value: number): void;

declare function ParameterChanged(name: number, value: number): void;

// ------ MIDI

declare class MIDI {
    /**
     * Returns the MIDI note number for a given note name.
     * For example: 'C3' or 'B#2'
     *
     * Note: you cannot use flats in your argument. Use A#3, not Bb3
     *
     * @param name - The name of the note.
     */
    public static noteNumber(name: string): Pitch;

    /**
     * Returns the name for a given MIDI note number.
     *
     * @param pitch - The note number.
     */
    public static noteName(pitch: Pitch): string;

    /**
     * Returns the name of the name associated with a controller number.
     *
     * @param controller - The controller number from 0 to 127.
     */
    public static ccName(controller: CC): string;

    /**
     * Sends the all notes off message on all MIDI channels.
     */
    public static allNotesOff(): void;

    /**
     * Normalizes a status to the safe range of MIDI status bytes (128-239).
     *
     * @param status - The status value to normalize
     * @returns The normalized status.
     */
    public static normalizeStatus(status: number): number;

    /**
     * Normalizes a value to the safe range of MIDI channels (1-16).
     *
     * @param channel - The value to normalize.
     * @returns The normalized value.
     */
    public static normalizeChannel(channel: number): number;

    /**
     * Normalizes a value to the safe range of MIDI data bytes (0-127).
     *
     * @param data - The value to normalize.
     * @returns The normalized value.
     */
    public static normalizeData(data: number): number;
}

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

// CC Notes sourced from
// https://nickfever.com/Music/midi-cc-list
declare const enum CC {
    /**
     * Allows user to switch bank for patch selection. Program change used with Bank Select.
     * MIDI can access 16,384 patches per MIDI channel.
     */
    BankSelect = 0,

    /**
     * Generally this CC controls a vibrato effect (pitch, loudness, brighness).
     * What is modulated is based on the patch.
     */
    Modulation = 1,

    /**
     * Often times associated with aftertouch messages. It was originally intended for
     * use with a breath MIDI controller in which blowing harder produced higher MIDI
     * control values. It can be used for modulation as well.
     */
    BreathController = 2,

    /**
     * Often used with aftertouch messages. It can send a continuous stream of values
     * based on how the pedal is used.
     */
    FootController = 4,

    /**
     * Controls portamento rate to slide between 2 notes played subsequently.
     */
    PortamentoTime = 5,

    /**
     * Controls Value for NRPN or RPN parameters.
     */
    DataEntryMsb = 6,

    /**
     * Control the volume of the channel.
     */
    Volume = 7,

    /**
     * Controls the left and right balance, generally for stereo patches.
     *
     * 0 = hard left, 64 = center, 127 = hard right
     */
    Balance = 8,

    /**
     * Controls the left and right balance, generally for mono patches.
     *
     * 0 = hard left, 64 = center, 127 = hard right
     */
    Pan = 10,

    /**
     * Expression is a percentage of volume (CC7).
     */
    Expression = 11,

    /**
     * Usually used to control a parameter of an effect within the
     * synth/workstation.
     */
    EffectController1 = 12,

    /**
     * Usually used to control a parameter of an effect within the
     * synth/workstation.
     */
    EffectController2 = 13,

    BankSelectLsb = 32,
    ModulationLsb = 33,
    BreathControllerLsb = 34,
    FootControllerLsb = 36,
    PortamentoTimeLsb = 37,
    DataEntryLsb = 38,
    VolumeLsb = 39,
    BalanceLsb = 40,
    PanLsb = 42,
    ExpressionLsb = 43,
    EffectController1Lsb = 44,
    EffectController2Lsb = 45,

    /**
     * On/Off switch that controls sustain. (See also Sostenuto CC 66)
     *
     * 0 to 63 = Off, 64 to 127 = On
     */
    Hold = 64,

    /**
     * Portamento On/Off switch
     *
     * 0 to 63 = Off, 64 to 127 = On
     */
    PortamentoOnOff = 65,

    /**
     * On/Off switch – Like the Sustain controller (CC 64), however it only
     * holds notes that were “On” when the pedal was pressed. People use it
     * to “hold” chords and play melodies over the held chord.
     *
     * 0 to 63 = Off, 64 to 127 = On
     */
    SostenutoOnOff = 66,

    /**
     * Soft pedal On/Off switch. Lowers the volume of notes played.
     *
     * 0 to 63 = Off, 64 to 127 = On
     */
    SoftPedalOnOff = 67,

    /**
     * On/Off switch - Turns Legato effect between 2 subsequent notes On or Off.
     *
     * 0 to 63 = Off, 64 to 127 = On
     */
    LegatoOnOff = 68,

    /**
     * Another way to “hold notes” (see MIDI CC 64 and MIDI CC 66).
     * However notes fade out according to their release parameter
     * rather than when the pedal is released.
     */
    Hold2 = 69,

    /**
     * Usually controls the way a sound is produced.
     *
     * Default = Sound Variation.
     */
    SoundController1 = 70,

    /**
     * Allows shaping the Voltage Controlled Filter (VCF).
     *
     * Default = Resonance - also(Timbre or Harmonics)
     */
    SoundController2 = 71,

    /**
     * Controls release time of the Voltage controlled Amplifier (VCA).
     *
     * Default = Release Time.
     */
    SoundController3 = 72,

    /**
     * Controls the “Attack’ of a sound. The attack is the amount of time
     * it takes for the sound to reach maximum amplitude.
     */
    SoundController4 = 73,

    SoundController5 = 74,
    SoundController6 = 75,
    SoundController7 = 76,
    SoundController8 = 77,
    SoundController9 = 78,
    SoundController10 = 79,

    GeneralPurposeOnOff1 = 80,
    GeneralPurposeOnOff2 = 81,
    GeneralPurposeOnOff3 = 82,
    GeneralPurposeOnOff4 = 83,

    /**
     * Controls the amount of Portamento.
     */
    PortamentoAmount = 84,

    /**
     * Usually controls reverb send amount.
     */
    Effect1Depth = 91,

    /**
     * Usually controls tremolo amount.
     */
    Effect2Depth = 92,

    /**
     * Usually controls chorus amount.
     */
    Effect3Depth = 93,

    /**
     * Usually controls detune amount.
     */
    Effect4Depth = 94,

    /**
     * Usually controls phaser amount.
     */
    Effect5Depth = 95,

    /**
     * Usually used to increment data for RPN and NRPN messages.
     */
    DataIncrement = 96,

    /**
     * Usually used to decrement data for RPN and NRPN messages.
     */
    DataDecrement = 97,

    /**
     * For controllers 6, 38, 96, and 97, it selects the NRPN parameter.
     */
    NonRegisteredParameterNumberLsb = 98,

    /**
     * For controllers 6, 38, 96, and 97, it selects the NRPN parameter.
     */
    NonRegisteredParameterNumberMsb = 99,

    /**
     * For controllers 6, 38, 96, and 97, it selects the RPN parameter.
     */
    RegisteredParameterNumberLsb = 100,

    /**
     * For controllers 6, 38, 96, and 97, it selects the RPN parameter.
     */
    RegisteredParameterNumberMsb = 101,

    /**
     * Mutes all sounding notes. It does so regardless of release time or sustain.
     * (See MIDI CC 123)
     */
    AllSoundOff = 120,

    /**
     * Resets all controllers to their default.
     */
    ResetAllControllers = 121,

    /**
     * Turns internal connection of a MIDI keyboard/workstation, etc.
     * On or Off. If you use a computer, you will most likely want
     * local control off to avoid notes being played twice. Once
     * locally and twice whent the note is sent back from the computer
     * to your keyboard.
     */
    LocalOnOff = 122,

    /**
     * Mutes all sounding notes. Release time will still be maintained,
     * and notes held by sustain will not turn off until sustain pedal
     * is depressed.
     */
    AllNotesOff = 123,

    /**
     * Sets to "Omni Off" mode.
     */
    OmniModeOff = 124,

    /**
     * Set to "Omni On" mode.
     */
    OmniModeOn = 125,

    /**
     * Sets device mode to Monophonic.
     */
    MonoMode = 126,

    /**
     * Sets device mode to Polyphonic.
     */
    PolyMode = 127
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
    /** Sends the event. */
    send(): void;

    /**
     * Sends the event after a certain number of milliseconds has elapsed.
     *
     * @param ms - The number of milliseconds to wait before sending the event.
     */
    sendAfterMilliseconds(ms: number): void;

    /**
     * Sends the event after a certain number of beats.
     *
     * @param beat - The number of beats to wait before sending the event.
     */
    sendAtBeat(beat: number): void;

    /** Prints the event to the plug-in console. */
    trace(): void;

    /** @returns A string representation of the event. */
    toString(): string;

    /** The MIDI channel of the event. Can be a value between 1 and 16. */
    channel: number;

    /**
     * The beat position of the event. {@link MidiEvent.send} sends this
     * event at the specified beat.
     */
    beatPos: number;

    /**
     * The articulation ID of the note/event.
     */
    articulationID: number;
}

declare class NoteOn extends MidiEvent {
    /** Pitch from 1 to 127. */
    pitch: Pitch;

    /**
     * Velocity from 0 to 127. If the velocity is 0, the event will be interpreted
     * as a Note Off instead of a Note On.
     */
    velocity: number;
}

declare class NoteOff extends MidiEvent {
    /** Pitch from 1 to 127. */
    pitch: Pitch;

    /** Velocity from 0 to 127. */
    velocity: number;
}

/**
 * Polyphonic aftertouch event. This is not commonly supported on synthesizers.
 */
declare class PolyPressure extends MidiEvent {
    /** Pitch from 1 to 127. */
    pitch: Pitch;

    /** Pressure value from 0 to 127. */
    value: number;
}

declare class ProgramChange extends MidiEvent {
    /** Program number from 0 to 127. */
    number: number;
}

declare class ControlChange extends MidiEvent {
    /**
     * The controller number from 0 to 127. Use {@link MIDI.controllerName} to look up
     * the name of the controller.
     */
    number: CC;

    /** The controller value from 0 to 127. */
    value: number;
}

/** Aftertouch event. */
declare class ChannelPressure extends MidiEvent {
    /** Aftertouch value from 0 to 127. */
    value: number;
}

/** Pitch bend event. */
declare class PitchBend extends MidiEvent {
    /** 14-bit pitch bend value from -8192 to 8191. A value of 0 is center. */
    value: number;
}

/**
 * With the TargetEvent object you can create user definable MIDI CC messages
 * or control plug-in parameters.
 *
 * The object reads the parameter to be modified from a menu in which the user can select
 * a destination MIDI CC, or use the Learn Plug-in Parameter command to assign any
 * parameter of a plug-in inserted after (below) Scripter in the same channel strip.
 * The chosen destination is saved with the plug-in setting.
 */
declare class TargetEvent extends MidiEvent {
    /** Name of the {@link TargetParameter} in the script plug-in's parameter list. */
    target: string;

    /** Value of set target from 0.0 to 1.0 */
    value: number;
}

// ------ Timing Info

/**
 * The TimingInfo object contains timing information that describes the state of
 * the host transport and the current musical tempo and meter. A TimingInfo
 * object can be retrieved by calling {@link GetTimingInfo}
 *
 * Note: the length of a beat is determined by the host application time signature
 * and tempo.
 */
declare interface TimingInfo {
    /**
     * A boolean value that is true if the host transport is running and false
     * if it is not.
     */
    playing: boolean;

    /** A floating point number that indicates the beat position at the start of the process block. */
    blockStartBeat: number;

    /** A floating point number that indicates the beat position at the end of the process block. */
    blockEndBeat: number;

    /** A floating point number that indicates the length of the processing block in beats. */
    blockSize: number;

    /** A floating point number that indicates the host tempo. */
    tempo: number;

    /** An integer that indcates the host meter numerator. */
    meterNumerator: number;

    /** An integer that indicates the host meter denominator. */
    meterDenominator: number;

    /** A boolean value that is true if the host transport is cycling and false if it is not */
    cycling: boolean;

    /** A floating point number indicating the beat position at the start of the cycle range. */
    leftCycleBeat: number;

    /** A floating point number indicating the beat position at the end of the cycle range. */
    rightCycleBeat: number;
}

/**
 * Retrieves the current host timing information. The script plug-in must have
 * NeedsTimingInfo set to true for this function to work.
 */
declare function GetTimingInfo(): TimingInfo;

// ------ Trace

/** Prints a string value to the plug-in console. */
declare function Trace(value: string): void;

// ------ Plugin

declare interface ScripterPlugin {
    PluginParameters?: PluginParametersType;

    /**
     * Handler for processing MIDI events that the plug-in receives.
     * It is called each time a MIDI event is received by the plug-in
     * and is required to process incoming MIDI events. If this function
     * is not implemented, events pass through the plug-in unaffected.
     *
     * @param event - The incoming MIDI event.
     */
    HandleMIDI?: (event: MidiEvent) => void;

    /**
     * This function is called periodically to allow for generally
     * timing-related tasks. It can be used when scripting a sequencer,
     * arpeggiator, or other tempo-driven MIDI effect. It is generally
     * not required for applications that do not make use of musical
     * timing information from the host. It is called once per "process block,"
     * which is determined by the host's audio settings (sample rate and buffer
     * size).
     *
     * This function will often be used in combination with the {@link TimingInfo}
     * object to make use of timing information from the host application.
     */
    ProcessMIDI?: () => void;

    Reset?: () => void;

    /**
     * Handler that is called each time one of the plug-in's parameters
     * is set to a new value. This function is also called once for each
     * parameter when a new plug-in setting is loaded.
     *
     * @param param - An integer value starting from 0 representing the index
     *                of the parameter that has been changed.
     * @param value - The new value of the parameter.
     */
    ParameterChanged?: (param: number, value: number) => void;

    /**
     * A boolean value indicating whether the host should expose timing information
     * to the plug-in through the {@link GetTimingInfo} function.
     */
    NeedsTimingInfo?: boolean;
}
