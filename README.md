# Logic/MainStage Scripter Plugins

Some Logic/MainStage Scripter plugins - if you just want the plugins, check out
the `plugins/` folder. Paste the plugin.js contents into a Scripter instance and
you're good to go!

## Development

Writing scripts in Scripter's editor isn't ideal, and since I use these for playing
live I figured it made sense to use tests and TypeScript to try to make sure they
are solid.

To make them testable, the plugins can't be written exactly as they would be in
Scripter. Instead of defining globals (e.g. `PluginParameters = ...` or
`function HandleMIDI(...`) export a const object called `plugin` with the type
`ScripterPlugin`. The globals used by Scripter should be properties on the object.

For example:

```typescript
export const plugin: ScripterPlugin = {
    PluginParameters: [
        {
            name: "Disable",
            type: "checkbox"
        }
    ],
    HandleMIDI: (event: MidiEvent) => {
        if (!GetParameter("Disable")) {
            event.send();
        }
    }
};
```

### Setup

`yarn install` should be enough to get set up.

### TypeScript

`global.d.ts` includes types for Scripter and some handy Enums.

### Tests

Use `yarn test` and `yarn test-watch` to run tests.

`test-helpers.ts` has testers to help instantiating and testing plugins.

### Building

Runing `yarn build` compiles the typescript then runs `node build.js`. `build.js`
cleans up the typescript output and converts the `export const plugin` into global
definitions. The output is put in the `plugins/` folder.

Comment blocks at the top of the files are copied into `README.md` in the plugin folder.

The build output is checked in to git to make it easy for anyone to grab the scripts.
