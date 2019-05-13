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
