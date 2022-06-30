const fs = require('fs');
let client;

module.exports = {
    LoadModules(c) {
        client = c;

        const modules = getDirectories('./Modules');
        modules.forEach(m => {
            LoadModule(m);
        });
    },
};

function LoadModule(name) {
    console.log(`[ModuleLoader] Loading Module: ${name}`);
    const meta = require(`../Modules/${name}/meta.js`);

    if (!meta.coreModule)
        client.modules.push(name);

    if (meta.events) {
        meta.events.forEach(e => {
            LoadModuleEvent(`../Modules/${name}/${e}.js`, name, meta);
        });
    }

    if (meta.buttons) {
        meta.buttons.forEach(b => {
            LoadButtonEvent(`../Modules/${name}/${b}.js`, name, meta);
        });
    }

    if (meta.menus) {
        meta.menus.forEach(m => {
            LoadMenuEvent(`../Modules/${name}/${m}.js`, name, meta);
        });
    }

    LoadModuleCommands(name);
}

function LoadModuleEvent(path, module, meta) {
    const evt = require(`${path}`);
    if (meta.PreEventInit)
        meta.PreEventInit(client, evt);
    console.log(`[ModuleLoader] Registered Module Event: '${path}'`);
    evt.module = module;
    if (evt.permission)
        AddPermission(evt.permission);
    const ch = ModuleTest;
    if (meta.PostEventInit)
        meta.PostEventInit(client, evt);
    client.on(evt.eventType, ch.bind({ evt, meta }, client));
}

function LoadButtonEvent(path, module, meta) {
    const evt = require(`${path}`);
    if (meta.PreButtonInit)
        meta.PreButtonInit(client, evt);
    console.log(`[ModuleLoader] Registered Module Button: '${path}'`);
    evt.module = module;
    if (evt.permission)
        AddPermission(evt.permission);
    if (meta.PostButtonInit)
        meta.PostButtonInit(client, evt);
    client.buttons.push(evt);
}

function LoadMenuEvent(path, module, meta) {
    const evt = require(`${path}`);
    if (meta.PreMenuInit)
        meta.PremenuInit(client, evt);
    console.log(`[ModuleLoader] Registered Module Menu: '${path}'`);
    evt.module = module;
    if (evt.permission)
        AddPermission(evt.permission);
    if (meta.PostMenuInit)
        meta.PostMenuInit(client, evt);
    client.menus.push(evt);
}

function LoadModuleCommand(cmd, dir, module) {
    const command = require(`../Modules/${module}/commands/${dir}/${cmd}`);
    command.category = dir;
    command.module = module;
    if (command.permission)
        AddPermission(command.permission, (command.options) ? command.options : null);
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
            const files = fs.readdirSync(`./Modules/${module}/commands/${dir}`).filter(file => file.endsWith('.js'));
            for (const file of files) {
                LoadModuleCommand(file, dir, module);
            }
        });
    }
}

async function ModuleTest(cl, a, b, c) {
    const Discord = require('discord.js');
    if (this.meta.coreModule) {
        return this.evt.event(cl, a, b, c);
    }
    if (a instanceof Discord.Channel) {
        if (await a.guild.hasModule(this.evt.module)) {
            this.evt.event(cl, a, b, c);
        }
    } else if (a instanceof Discord.Emoji) {
        if (await a.guild.hasModule(this.evt.module)) {
            this.evt.event(cl, a, b, c);
        }
    } else if (a instanceof Discord.Guild) {
        if (await a.hasModule(this.evt.module)) {
            this.evt.event(cl, a, b, c);
        }
    } else if (a instanceof Discord.GuildMember) {
        if (await a.guild.hasModule(this.evt.module)) {
            this.evt.event(cl, a, b, c);
        }
    } else if (a instanceof Discord.Message) {
        if (await a.guild.hasModule(this.evt.module)) {
            this.evt.event(cl, a, b, c);
        }
    } else if (a instanceof Discord.Collection) {
        const e = a.first();
        if (typeof (e) === Discord.Message) {
            if (await e.guild.hasModule(this.evt.module)) {
                this.evt.event(cl, a, b, c);
            }
        }
    } else if (a instanceof Discord.MessageReaction) {
        if (await a.message.guild.hasModule(this.evt.module)) {
            this.evt.event(cl, a, b, c);
        }
    } else if (a instanceof Discord.Role) {
        if (await a.guild.hasModule(this.evt.module)) {
            this.evt.event(cl, a, b, c);
        }
    } else if (a instanceof Discord.Interaction) {
        if (await a.member.guild.hasModule(this.evt.module)) {
            this.evt.event(cl, a, b, c);
        }
    } else {
        this.evt.event(cl, a, b, c);
    }
}

function AddPermission(permission, options) {
    const split = permission.split('.');
    const group = split[0] + '.*';
    const optionPerms = [];
    const optionGroups = [];

    if (options) {
        options.forEach(p => {
            if (p.permission) {
                const oSplit = p.permission.split('.');
                const oGroup = oSplit[0] + '.*';

                optionPerms.push(p.permission);
                optionGroups.push(oGroup);
            }
        });

        optionPerms.forEach(p => {
            if (!client.permissions.includes(p)) {
                client.permissions.push(p);
            }
        });

        optionGroups.forEach(p => {
            if (!client.permissions.includes(p)) {
                client.permissions.push(p);
            }
        });
    }

    if (!client.permissions.includes(permission)) {
        client.permissions.push(permission);
    }

    if (!client.permissions.includes(group)) {
        client.permissions.push(group);
    }

    client.permissions.sort();
}

// Gets all directories in a path
function getDirectories(path) {
    if (!fs.existsSync(path)) return false;
    return fs.readdirSync(path).filter(function(file) {
      return fs.statSync(path + '/' + file).isDirectory();
    });
}