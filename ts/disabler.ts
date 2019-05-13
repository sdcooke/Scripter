/*
# DISABLER

Provides 2 "disable" checkboxes - if either is checked, MIDI Note On messages
are blocked. Useful if you have multiple things disabling a layer (e.g. disabling
two instruments together whilst being able to switch between them).

Also because only Note On messages are blocked, it can be used to seamlessly
transition between instruments - when notes are lifted the message will get through.
Control Change messages will also get through which means if you pushed the pedal
before enableing, the plugin received that message (MainStage layer bypass does
not do that, which can be annoying).
*/
export const plugin: ScripterPlugin = {
    PluginParameters: [
        {
            name: "Disable 1",
            type: "checkbox",
            defaultValue: 0
        },
        {
            name: "Disable 2",
            type: "checkbox",
            defaultValue: 0
        }
    ],
    HandleMIDI: (event: MidiEvent) => {
        var disable = GetParameter("Disable 1") || GetParameter("Disable 2");

        if (event instanceof NoteOn) {
            if (!disable && event && event.send) {
                event.send();
            }
        } else {
            if (event && event.send) {
                event.send();
            }
        }
    }
};
