var createdEvents: MidiEvent[] = [];

export class MidiEvent {
    sent = false;

    constructor(values?: {}) {
        Object.assign(this, values);
        createdEvents.push(this);
    }

    send() {
        this.sent = true;
    }

    sendAfterMilliseconds(ms: number) {}

    sendAtBeat(beat: number) {}

    trace() {}

    toString() {
        return "";
    }

    channel = 1;
    beatPos = 1;
    articulationID = 1;

}

export const Pitch = {
    C3: 48,
    Db3: 49,
    D3: 50,
    C7: 96,
    Db7: 97,
    D7: 98,
    C8: 108
};

export const Note = {
    C: "C",
    Db: "Db",
    D: "D",
    Eb: "Eb",
    E: "E",
    F: "F",
    Gb: "Gb",
    G: "G",
    Ab: "Ab",
    A: "A",
    Bb: "Bb",
    B: "B"
};

// @ts-ignore
global.Note = Note;
// @ts-ignore
global.CC = CC;
// @ts-ignore
global.Pitch = Pitch;

export class NoteOn extends MidiEvent {
    pitch: number = this.pitch || Pitch.C3;
    velocity: number = 100;
}

export class NoteOff extends MidiEvent {
    pitch: number = this.pitch || Pitch.C3;
}

export const CC = {
    Modulation: 1,
    Hold: 64
};

export class ControlChange extends MidiEvent {
    number: number = this.number || CC.Modulation;
    value: number = typeof this.value === "undefined" ? 127 : this.value;
}

type ParameterWithDetails = Parameter & { value: number; index: number };

export class Plugin {
    private plugin: ScripterPlugin;
    readonly parameters: Map<string, ParameterWithDetails> = new Map();

    getParameter = (name: string): number => {
        const parameter = this.parameters.get(name);
        if (parameter) {
            return parameter.value;
        }
        throw Error("Unknown parameter name");
    };

    setParameter = (name: string, value: number) => {
        const parameter = this.parameters.get(name);
        if (parameter) {
            parameter.value = value;
            if (this.plugin.ParameterChanged) {
                this.plugin.ParameterChanged(parameter.index, value);
            }
        } else {
            throw Error(`Unknown parameter ${name} - parameters are ${Array.from(this.parameters.keys()).join(", ")}`);
        }
    };

    globals = {
        GetParameter: this.getParameter,
        SetParameter: this.setParameter,
        NoteOn,
        NoteOff,
        ControlChange,
        Note,
        CC,
        Pitch
    };

    constructor(plugin: ScripterPlugin) {
        this.plugin = plugin;
        if (plugin.PluginParameters) {
            plugin.PluginParameters.forEach((parameter, index) => {
                const details: ParameterWithDetails = { ...parameter, value: 0, index };
                if ("defaultValue" in parameter) {
                    details.value = parameter.defaultValue;
                }
                this.parameters.set(parameter.name, details);
            });
        }

        if (plugin.Reset) {
            this.setGlobals();
            plugin.Reset();
        }
    }

    private setGlobals() {
        Object.assign(global, this.globals);
    }

    handleMIDI(event: MidiEvent) {
        if (this.plugin.HandleMIDI) {
            this.setGlobals();
            this.plugin.HandleMIDI(event);
        } else {
            throw Error("Plugin does not have a HandleMIDI function");
        }
    }

    getParameterValues() {
        const values: { [name: string]: number } = {};
        this.parameters.forEach(parameter => {
            values[parameter.name] = parameter.value;
        });
        return values;
    }

    checkSend(event: MidiEvent, expected: boolean) {
        expect(event.sent).toEqual(false);
        this.handleMIDI(event);
        expect(event.sent).toEqual(expected);
    }

    expectSentEvents(callback: () => void, expected: MidiEvent[]) {
        createdEvents = [];
        callback();
        const sentEvents = createdEvents.filter(event => event.sent);
        expect(sentEvents.length).toEqual(expected.length);
        sentEvents.forEach((event, index) => {
            expect(event.constructor).toBe(expected[index].constructor);
            Object.keys(event)
                .filter(k => k !== "sent")
                .forEach(k => {
                    // @ts-ignore
                    expect(event[k]).toEqual(expected[index][k]);
                });
        });
    }
}
