/*
# Drone

Plugin that can be used for drone pads.

Notes C7-B7 toggle on press, also cancelling any other pressed notes.
Pressing C8 stops any playing drone.

*/

var activePitch = null;
var NOTES = [
    "C" /* C */,
    "Db" /* Db */,
    "D" /* D */,
    "Eb" /* Eb */,
    "E" /* E */,
    "F" /* F */,
    "Gb" /* Gb */,
    "G" /* G */,
    "Ab" /* Ab */,
    "A" /* A */,
    "Bb" /* Bb */,
    "B" /* B */
];
var getNoteIndexFromPitch = function(pitch) {
    return pitch - 96 /* C7 */;
};
var getPitchFromNote = function() {
    return GetParameter("Note") + 96 /* C7 */;
};
var Play = function(pitch) {
    if (pitch === activePitch) {
        return;
    }
    if (activePitch) {
        Stop();
    }
    activePitch = pitch;
    var event = new NoteOn();
    event.pitch = activePitch;
    event.send();
    SetParameter("Note", getNoteIndexFromPitch(activePitch));
    SetParameter("Active", 1);
};
var Stop = function() {
    if (activePitch === null) {
        return;
    }
    var event = new NoteOff();
    event.pitch = activePitch;
    event.send();
    activePitch = null;
    SetParameter("Active", 0);
};

PluginParameters = [
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
];

function HandleMIDI(event) {
    if (event instanceof NoteOn) {
        if (event.pitch < 96 /* C7 */ || event.pitch > 108 /* C8 */) {
            return;
        }
        if (event.pitch === 108 /* C8 */ || event.pitch === activePitch) {
            Stop();
        } else {
            Play(event.pitch);
        }
    }
}

function ParameterChanged(param, value) {
    if ((param === 0 && value) || param === 1) {
        Play(getPitchFromNote());
    } else if (param === 0 && !value) {
        Stop();
    }
}

function Reset() {
    Stop();
}
