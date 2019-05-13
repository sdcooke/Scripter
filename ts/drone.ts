/*
# Drone

Plugin that can be used for drone pads.

Notes C7-B7 toggle on press, also cancelling any other pressed notes.
Pressing C8 stops any playing drone.

Can also be controlled by automating parameters.
*/

var activePitch: Pitch | null = null;

const NOTES = [Note.C, Note.Db, Note.D, Note.Eb, Note.E, Note.F, Note.Gb, Note.G, Note.Ab, Note.A, Note.Bb, Note.B];

const getNoteIndexFromPitch = (pitch: Pitch): number => pitch - Pitch.C7;
const getPitchFromNote = (): Pitch => GetParameter("Note") + Pitch.C7;

const Play = (pitch: Pitch) => {
    if (pitch === activePitch) {
        return;
    }

    if (activePitch) {
        Stop();
    }

    activePitch = pitch;

    const event = new NoteOn();
    event.pitch = activePitch;
    event.send();

    SetParameter("Note", getNoteIndexFromPitch(activePitch));
    SetParameter("Active", 1);
};

const Stop = () => {
    if (activePitch === null) {
        return;
    }

    const event = new NoteOff();
    event.pitch = activePitch;
    event.send();

    activePitch = null;

    SetParameter("Active", 0);
};

export const plugin: ScripterPlugin = {
    PluginParameters: [
        {
            // 0
            name: "Active",
            type: "checkbox",
            defaultValue: 0
        },
        {
            // 1
            name: "Retrigger",
            type: "momentary"
        },
        {
            // 2
            name: "Note",
            type: "menu",
            valueStrings: NOTES
        }
    ],
    HandleMIDI: (event: MidiEvent) => {
        if (event instanceof NoteOn) {
            if (event.pitch < Pitch.C7 || event.pitch > Pitch.C8) {
                return;
            }

            if (event.pitch === Pitch.C8 || event.pitch === activePitch) {
                Stop();
            } else {
                Play(event.pitch);
            }
        }
    },
    ParameterChanged: (param: number, value: number) => {
        if ((param === 0 && value) || param === 1) {
            Play(getPitchFromNote());
        } else if (param === 0 && !value) {
            Stop();
        }
    },
    Reset: () => {
        Stop();
    }
};
