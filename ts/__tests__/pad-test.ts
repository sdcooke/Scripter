import { plugin as pad } from "../pad";
import { Plugin, NoteOn, NoteOff, ControlChange, Pitch, CC } from "../test-helpers";
import { testDisableCheckboxes } from "./disabler-test";

describe("pad", () => {
    it("should disable if either checkbox is checked", () => {
        testDisableCheckboxes(new Plugin(pad));
    });

    it("should not send NoteOff if pedal is held", () => {
        const plugin = new Plugin(pad);

        // Note pressed before pedal held
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), true);
        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);
        plugin.checkSend(new NoteOff({ pitch: Pitch.C3 }), false);

        // Note pressed after pedal held
        plugin.checkSend(new NoteOn({ pitch: Pitch.Db3 }), true);
        // Pedal is still held
        plugin.checkSend(new NoteOff({ pitch: Pitch.Db3 }), false);
    });

    it("should not send NoteOn twice if pedal is held", () => {
        const plugin = new Plugin(pad);

        // Note pressed before pedal held
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), true);
        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);
        plugin.checkSend(new NoteOff({ pitch: Pitch.C3 }), false);
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), false);

        // Note pressed after pedal held
        plugin.checkSend(new NoteOn({ pitch: Pitch.Db3 }), true);
        plugin.checkSend(new NoteOff({ pitch: Pitch.Db3 }), false);
        plugin.checkSend(new NoteOn({ pitch: Pitch.Db3 }), false);
    });

    it("should generate NoteOff for held notes when pedal is released", () => {
        const plugin = new Plugin(pad);

        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), true);
        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);
        plugin.checkSend(new NoteOn({ pitch: Pitch.Db3 }), true);
        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), true);

        // Release some notes
        plugin.checkSend(new NoteOff({ pitch: Pitch.Db3 }), false);
        plugin.checkSend(new NoteOff({ pitch: Pitch.D3 }), false);

        const pedalUp = new ControlChange({ number: CC.Hold, value: 0 });
        // Release the pedal
        plugin.expectSentEvents(() => {
            plugin.checkSend(pedalUp, true);
        }, [
            // Pitch.C is not sent because it is still held down
            new NoteOff({ pitch: Pitch.Db3 }),
            new NoteOff({ pitch: Pitch.D3 })
        ]);
    });

    it("should handle notes held before and after pedal", () => {
        const plugin = new Plugin(pad);

        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), true);
        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);
        plugin.checkSend(new NoteOff({ pitch: Pitch.C3 }), false);
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), false);

        const pedalUp = new ControlChange({ number: CC.Hold, value: 0 });
        plugin.expectSentEvents(() => {
            plugin.checkSend(pedalUp, true);
        }, [
            // NoteOff is not sent
        ]);
    });

    it("should replay a note if it was pressed whilst disabled", () => {
        const plugin = new Plugin(pad);

        plugin.setParameter("Disable 1", 1);
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), false);
        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);

        plugin.expectSentEvents(() => {
            plugin.setParameter("Disable 1", 0);
        }, [
            // C3 is not played
        ]);

        // C3 is played, because it wasn't playing before
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), true);
    });

    it("should replay a note if it was pressed whilst disabled automatically", () => {
        const plugin = new Plugin(pad);

        plugin.setParameter("Fader Enable", 0);
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), false);
        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);

        plugin.expectSentEvents(() => {
            plugin.setParameter("Fader Enable", 0.1);
        }, [
            // C3 is played
            new NoteOn({ pitch: Pitch.C3 })
        ]);

        // C3 is not played, because it was automatically triggered
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), false);
    });

    it("should handle more complex scenarios - 1", () => {
        const plugin = new Plugin(pad);

        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);
        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), true);

        plugin.setParameter("Fader Enable", 0);
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), false);

        plugin.expectSentEvents(() => {
            plugin.setParameter("Fader Enable", 0.1);
        }, [
            // C3 is played, D3 is not because it was already playing
            new NoteOn({ pitch: Pitch.C3 })
        ]);

        // C3 is not played, because it was automatically triggered
        plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), false);
        // D3 is not played, because it was already playing
        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), false);

        plugin.checkSend(new NoteOff({ pitch: Pitch.C3 }), false);
        plugin.checkSend(new NoteOff({ pitch: Pitch.D3 }), false);

        const pedalUp = new ControlChange({ number: CC.Hold, value: 0 });
        plugin.expectSentEvents(() => {
            plugin.checkSend(pedalUp, true);
        }, [
            // Both notes are stopped
            new NoteOff({ pitch: Pitch.C3 }),
            new NoteOff({ pitch: Pitch.D3 })
        ]);
    });

    it("should handle more complex scenarios - 2", () => {
        const plugin = new Plugin(pad);

        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), true);
        plugin.checkSend(new NoteOff({ pitch: Pitch.D3 }), true);
        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), true);

        plugin.setParameter("Disable 1", 1);

        plugin.checkSend(new NoteOff({ pitch: Pitch.D3 }), true);
        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), false);

        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);
        plugin.setParameter("Disable 1", 0);
        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), true);
        plugin.checkSend(new NoteOff({ pitch: Pitch.D3 }), false);
    });

    it("should handle more complex scenarios - 3", () => {
        const plugin = new Plugin(pad);

        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), true);
        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);
        plugin.checkSend(new NoteOff({ pitch: Pitch.D3 }), false);

        plugin.setParameter("Disable 1", 1);

        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), false);

        const pedalUp = new ControlChange({ number: CC.Hold, value: 0 });
        plugin.expectSentEvents(() => {
            plugin.checkSend(pedalUp, true);
        }, [new NoteOff({ pitch: Pitch.D3 })]);

        // Sustain the note whilst disabled
        plugin.checkSend(new ControlChange({ number: CC.Hold }), true);
        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), false);
        plugin.checkSend(new NoteOff({ pitch: Pitch.D3 }), false);
        plugin.checkSend(new NoteOn({ pitch: Pitch.D3 }), false);
    });
});
