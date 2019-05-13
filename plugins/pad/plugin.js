/*
# PAD

Tools to make pad patches work nicely. Also includes the functionality
from the DISABLER plugin.

If you are playing, for example, piano with a bad beneath it you will
be playing the same note multiple times with the pedal held down. Some
instruments retrigger the note every time it is pressed, causing the
same note to layer up and become louder until the pedal is lifted. This
plugin will block a Note On message when the note has already been played
with the pedal down.

In addition to the Disable 1 and Disable 2 checkboxes there is a Fader
Enable slider. This can be assigned to a knob or slider that is used to
fade a pad in. If its value is 0 notes will not be sent to the instrument,
which can be useful to avoid the plugin using CPU whilst not making sound.
When the value changes above 0 if any notes are currently being held they
will be triggered so the instrument instantly starts playing. Without this
functionality, it would be necessary to play notes again before the
instrument started playing.

*/

/*
Unfortunately there are lots of edge cases for this plugin, so it turned
out more complicated than expected! The plugin has to handle sending
Note Off messages when the pedal is lifted. If it didn't, and the following
happened:

Pedal down
Note On C3
Note Off C3
Note On C3
Pedal up <-- C3 would stop playing here

because mainstage never got the second Note On, it does not know it should
continue playing.
*/
// Notes that are currently pressed down
var pressedNotes = new Map();
// When NoteOff has been received but the sustain pedal was down
// - it's necessary to track this and handle it manually because
// it's possible to press a note twice whilst the pedal is down
var sustainedNotes = new Map();
// Whether the sustain pedal is down
var sustainPedalHeld = false;
// Used to keep track of disabled state after parameter changes
var wasDisabled = false;
function isDisabled() {
    return !!GetParameter("Disable 1") || !!GetParameter("Disable 2") || !GetParameter("Fader Enable");
}

PluginParameters = [
    {
        // 0
        name: "Disable 1",
        type: "checkbox",
        defaultValue: 0
    },
    {
        // 1
        name: "Disable 2",
        type: "checkbox",
        defaultValue: 0
    },
    {
        // 2
        name: "Fader Enable",
        type: "lin",
        defaultValue: 1.0
    }
];

function HandleMIDI(event) {
    var disable = isDisabled();
    var block = false;
    if (event instanceof ControlChange && event.number === 64 /* Hold */) {
        sustainPedalHeld = !!event.value;
        if (!sustainPedalHeld) {
            sustainedNotes.forEach(function(enabled, pitch) {
                var noteOff = new NoteOff();
                noteOff.pitch = pitch;
                noteOff.send();
            });
            sustainedNotes = new Map();
        }
    }
    if (event instanceof NoteOn) {
        if (disable) {
            // Only block NoteOn messages if it's disabled (like the DISABLER plugin)
            block = true;
            if (!sustainedNotes.get(event.pitch)) {
                // If it is sustained already, just leave it in sustained so it will die
                // when the sustain pedal is lifted
                pressedNotes.set(event.pitch, false);
                sustainedNotes["delete"](event.pitch);
            }
        } else {
            if (pressedNotes.get(event.pitch) || sustainedNotes.get(event.pitch)) {
                // It's already being played, don't send the note again
                block = true;
            }
            pressedNotes.set(event.pitch, true);
            sustainedNotes["delete"](event.pitch);
        }
    } else if (event instanceof NoteOff) {
        if (sustainPedalHeld && pressedNotes.has(event.pitch)) {
            // Make sure the note sustains
            block = true;
            // Keep track of notes to stop playing when the sustain pedal is lifted
            sustainedNotes.set(event.pitch, !!pressedNotes.get(event.pitch));
        }
        pressedNotes["delete"](event.pitch);
    }
    if (!block && event && event.send) {
        event.send();
    }
}

function Reset() {
    pressedNotes = new Map();
    sustainedNotes = new Map();
    sustainPedalHeld = false;
    wasDisabled = isDisabled();
}

function ParameterChanged(param, value) {
    var newDisabled = isDisabled();
    if (wasDisabled && !newDisabled && param == 2) {
        sustainedNotes.forEach(function(enabled, pitch) {
            if (!enabled) {
                var noteOn = new NoteOn();
                noteOn.pitch = pitch;
                noteOn.send();
                sustainedNotes.set(pitch, true);
            }
        });
        pressedNotes.forEach(function(enabled, pitch) {
            if (!enabled) {
                var noteOn = new NoteOn();
                noteOn.pitch = pitch;
                noteOn.send();
                pressedNotes.set(pitch, true);
            }
        });
    }
    wasDisabled = newDisabled;
}
