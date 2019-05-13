/*
Modifies the typescript output so it can be easily pasted into a Scripter instance
*/
const fs = require("fs-extra");
const path = require("path");
const prettier = require("prettier");
const j = require("jscodeshift");

const IGNORE_RE = /^(__tests__|test-helpers\.js)$/;
const PLUGIN_DIRECTORY = path.join(__dirname, "plugins");

function buildPlugin(filename) {
    const { ext, name } = path.parse(filename);
    if (ext !== ".js") {
        throw Error("Unexpected file type");
    }
    const dir = path.join(PLUGIN_DIRECTORY, name);
    fs.mkdirSync(dir);

    var source = fs.readFileSync(path.join(__dirname, "js/", filename)).toString();

    // Remove "use strict"
    source = j(source)
        .find(j.ExpressionStatement)
        .filter(p => p.node.expression.value === "use strict")
        .forEach(p => {
            j(p).remove();
        })
        .toSource();

    // Make README.md from first comment
    var readme = null;
    j(source)
        .find(j.Comment)
        .filter(p => p.value.type === "CommentBlock")
        .at(0)
        .forEach(p => {
            readme = p.value.value.trim() + "\n";
            fs.writeFileSync(path.join(dir, "README.md"), readme);
            j(p).remove();
        });

    // Make things global
    j(source)
        .find(j.MemberExpression)
        .filter(p => p.node.object.name === "exports" && p.node.property.name === "plugin")
        .forEach(p => {
            p.parentPath.node.right.properties.forEach(property => {
                var globalExpression;
                if (property.value.type === "FunctionExpression") {
                    property.value.id = property.key.name;
                    globalExpression = property.value;
                } else {
                    globalExpression = j.assignmentExpression("=", j.identifier(property.key.name), property.value);
                }
                source = `${source}\n\n${j(globalExpression).toSource()}`;
            });
        });

    // Remove references to `exports`
    source = j(source)
        .find(j.Identifier)
        .filter(p => p.node.name === "exports")
        .forEach(p => {
            j(p.parentPath.parentPath).remove();
        })
        .toSource();

    // Remove @ts-ignore comments
    source = j(source)
        .find(j.Comment)
        .filter(p => p.value.value.trim() === "@ts-ignore")
        .forEach(p => {
            j(p).remove();
        })
        .toSource();

    if (readme) {
        source = `/*\n${readme}\n*/\n\n${source}`;
    }

    fs.writeFileSync(
        path.join(dir, "plugin.js"),
        prettier.format(source, prettier.resolveConfig.sync(__filename, "utf8"))
    );
}

function run() {
    fs.removeSync(PLUGIN_DIRECTORY);
    fs.mkdirSync(PLUGIN_DIRECTORY);

    const filenames = fs.readdirSync(path.join(__dirname, "js/"));

    filenames.forEach(filename => {
        if (!filename.match(IGNORE_RE)) {
            buildPlugin(filename);
        }
    });
}

run();
