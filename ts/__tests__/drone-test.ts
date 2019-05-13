import { Plugin, NoteOn, NoteOff, ControlChange, Pitch, Note } from "../test-helpers";
import { plugin as drone } from "../drone";

describe("drone", () => {
    it("should do nothing if notes out of range are passed", () => {
        const plugin = new Plugin(drone);
        plugin.expectSentEvents(() => {
            plugin.checkSend(new NoteOn({ pitch: Pitch.C3 }), false);
            plugin.checkSend(new NoteOff({ pitch: Pitch.C7 }), false);
            plugin.checkSend(new ControlChange(), false);
        }, []);
    });

    it("should trigger a NoteOn if a note is pressed (but no NoteOff)", () => {
        const plugin = new Plugin(drone);
        const noteOn = new NoteOn({ pitch: Pitch.C7 });
        const noteOff = new NoteOff({ pitch: Pitch.C7 });
        plugin.expectSentEvents(() => {
            plugin.checkSend(noteOn, false);
            plugin.checkSend(noteOff, false);
        }, [
            // A new NoteOn is generated
            new NoteOn({ pitch: Pitch.C7 })
        ]);
    });

    it("should trigger a NoteOff if the same note is pressed again", () => {
        const plugin = new Plugin(drone);
        plugin.checkSend(new NoteOn({ pitch: Pitch.C7 }), false);

        const noteOn = new NoteOn({ pitch: Pitch.C7 });
        plugin.expectSentEvents(() => {
            plugin.checkSend(noteOn, false);
        }, [
            // Toggled off
            new NoteOff({ pitch: Pitch.C7 })
        ]);
    });

    it("should trigger a NoteOff if C8 is pressed", () => {
        const plugin = new Plugin(drone);
        const noteOnC8_1 = new NoteOn({ pitch: Pitch.C8 });

        plugin.expectSentEvents(() => {
            plugin.checkSend(noteOnC8_1, false);
        }, [
            // Nothing playing...
        ]);

        plugin.checkSend(new NoteOn({ pitch: Pitch.C7 }), false);

        const noteOnC8_2 = new NoteOn({ pitch: Pitch.C8 });
        plugin.expectSentEvents(() => {
            plugin.checkSend(noteOnC8_2, false);
        }, [
            // Toggled off
            new NoteOff({ pitch: Pitch.C7 })
        ]);
    });

    it("should send a NoteOff for a currently playing drone when starting a new one", () => {
        const plugin = new Plugin(drone);

        plugin.checkSend(new NoteOn({ pitch: Pitch.C7 }), false);

        expect(plugin.getParameter("Note")).toEqual(0);

        const noteOn = new NoteOn({ pitch: Pitch.Db7 });
        plugin.expectSentEvents(() => {
            plugin.checkSend(noteOn, false);
        }, [
            // Toggled off
            new NoteOff({ pitch: Pitch.C7 }),
            // New note toggled
            new NoteOn({ pitch: Pitch.Db7 })
        ]);

        expect(plugin.getParameter("Note")).toEqual(1);
    });

    it("should trigger a note on Retrigger", () => {
        const plugin = new Plugin(drone);

        plugin.setParameter("Note", Pitch.D7 - Pitch.C7);

        plugin.expectSentEvents(() => {
            plugin.setParameter("Retrigger", 0);
        }, [
            // D7 triggered
            new NoteOn({ pitch: Pitch.D7 })
        ]);
    });

    it("should trigger a new note on Retrigger", () => {
        const plugin = new Plugin(drone);

        plugin.checkSend(new NoteOn({ pitch: Pitch.C7 }), false);
        expect(plugin.getParameter("Note")).toEqual(0);

        plugin.expectSentEvents(() => {
            plugin.setParameter("Retrigger", 0);
        }, [
            // It shouldn't retrigger the playing note
        ]);

        plugin.setParameter("Note", Pitch.D7 - Pitch.C7);

        plugin.expectSentEvents(() => {
            plugin.setParameter("Retrigger", 0);
        }, [
            // Toggled off
            new NoteOff({ pitch: Pitch.C7 }),
            // D7 triggered
            new NoteOn({ pitch: Pitch.D7 })
        ]);
    });
});
