const fs = require('fs');
let client;

module.exports = {
    LoadModules(c) {
        client = c;

        const modules = getDirectories('./Modules');
        modules.forEach(m => {
            LoadModule(m);
        });
    }
}

function LoadModule(name) {
    console.log(`[ModuleLoader] Loading Module: ${name}`);
    client.modules.push(name);
    const meta = require(`../Modules/${name}/meta.js`);

    if (meta.events) {
        meta.events.forEach(e => {
            LoadModuleEvent(`../Modules/${name}/${e}.js`, name);
        });    
    }

    LoadModuleCommands(name);
}

function LoadModuleEvent(path, module) {
    const evt = require(`${path}`);
    console.log(`[ModuleLoader] Registered Module Event: '${path}'`);
    evt.module = module;
    client.on(evt.eventType, evt.event.bind(null, client));
}

function LoadModuleCommand(cmd, dir, module) {
    const command = require(`../Modules/${module}/commands/${dir}/${cmd}`);
    command.category = dir;
    command.module = module;
    client.commands.set(command.name, command);
    console.log(`[ModuleLoader] Registered Module Command: '${command.name}'`);
    if (!client.commands.categories.includes(dir))
        client.commands.categories.push(dir);
}

function LoadModuleCommands(module) {
    const cmdDir = getDirectories(`./Modules/${module}/commands`);
    if (cmdDir) {
        console.log(`[ModuleLoader] Registering Commands for Module: '${module}'...`);
        cmdDir.forEach(dir => {
            let files = fs.readdirSync(`./Modules/${module}/commands/${dir}`).filter(file => file.endsWith('.js'));
            for (const file of files) {
                LoadModuleCommand(file, dir, module);
            }
        });
    }
}

// Gets all directories in a path
function getDirectories(path) {
    if (!fs.existsSync(path)) return false;
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
}