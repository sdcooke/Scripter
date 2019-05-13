import { plugin as disabler } from "../disabler";
import { Plugin, NoteOn, NoteOff, ControlChange } from "../test-helpers";

export function testDisableCheckboxes(plugin: Plugin) {
    plugin.checkSend(new NoteOn(), true);
    plugin.checkSend(new NoteOff(), true);
    plugin.checkSend(new ControlChange(), true);

    plugin.setParameter("Disable 1", 1);
    plugin.checkSend(new NoteOn(), false);
    plugin.checkSend(new NoteOff(), true);
    plugin.checkSend(new ControlChange(), true);

    plugin.setParameter("Disable 1", 0);
    plugin.setParameter("Disable 2", 1);
    plugin.checkSend(new NoteOn(), false);
    plugin.checkSend(new NoteOff(), true);
    plugin.checkSend(new ControlChange(), true);

    plugin.setParameter("Disable 2", 0);
    plugin.checkSend(new NoteOn(), true);
    plugin.checkSend(new NoteOff(), true);
    plugin.checkSend(new ControlChange(), true);
}

describe("disabler", () => {
    it("should disable if either checkbox is checked", () => {
        testDisableCheckboxes(new Plugin(disabler));
    });
});
