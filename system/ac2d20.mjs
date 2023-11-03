// Import document classes.
import { ACActor } from "./src/documents/actor.mjs";
import { ACItem } from "./src/documents/item.mjs";
// Import sheet classes.
import { ACActorSheet } from "./src/sheets/actor-sheet.mjs";
import { ACNPCSheet } from "./src/sheets/npc-sheet.mjs";
import { ACVehicleSheet } from "./src/sheets/vehicle-sheet.mjs";
import { ACItemSheet } from "./src/sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { AC2D20 } from "./src/helpers/config.mjs";
import { preloadHandlebarsTemplates } from "./src/helpers/templates.mjs";
import { registerHandlebarsHelpers } from "./src/helpers/handlebars.mjs"
//Import Roll2D20
import { Roller2D20 } from "./src/roller/ac2d20-roller.mjs"
import { Dialog2d20 } from './src/roller/dialog2d20.js'
import { DialogD6 } from './src/roller/dialogD6.js'
import DieACChallenge from './src/roller/challengeDie.js'
//Settings
import { registerSettings } from './src/settings.js';
// Text Enrichers
import { registerEnrichers } from './src/enrichers.mjs';
//Momentum
import { MomentumTracker } from './src/app/momentum-tracker.mjs'
//Combat Tracker
import Combat2d20 from "./src/combat/combat.mjs";
import CombatTracker2d20 from "./src/combat/combat-tracker.mjs";

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */
registerHandlebarsHelpers();


Hooks.once('init', async function () {
    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.

    game.ac2d20 = {
        ACActor,
        ACItem,
        Roller2D20,
        Dialog2d20,
        DialogD6,
        MomentumTracker,
    };

    // Add custom constants for configuration.
    CONFIG.AC2D20 = AC2D20;

    /**
   * Set an initiative formula for the system
   * @type {String}
   */
    CONFIG.Combat.initiative = {
        formula: "1",
        decimals: 0
    };

    // Define custom Document classes
    CONFIG.Actor.documentClass = ACActor;
    CONFIG.Item.documentClass = ACItem;
    CONFIG.Dice.terms["s"] = DieACChallenge;

	// Combat tracker stuff
	CONFIG.Combat.documentClass = Combat2d20;
	CONFIG.ui.combat = CombatTracker2d20;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("ac2d20", ACActorSheet, { types: ["character"], makeDefault: true });
    Actors.registerSheet("ac2d20", ACNPCSheet, { types: ["npc"], makeDefault: true });
    Actors.registerSheet("ac2d20", ACVehicleSheet, { types: ["vehicle"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("ac2d20", ACItemSheet, { makeDefault: true });

    // Register custom system settings
    registerSettings();

	// Register text enrichers.
	registerEnrichers();

    return preloadHandlebarsTemplates();
});

Hooks.on('ready', async () => {
    // set skill list
    const skillPackName = game.settings.get('ac2d20', 'compendium-skills');
    let packSkills = await game.packs.get(skillPackName).getDocuments();
    let _skills = []
    packSkills.forEach(s => {
        _skills.push({
            'label': s.name.toUpperCase(),
            'key': s.name,
            'focuses': s.system.focuses.map(f=> f.title)
          });
    });
    AC2D20.SKILLS = [..._skills];
    const listLocation = await game.settings.get('ac2d20', 'hoversJsonLocation')
    const jsonFile = await fetch(listLocation)
    const content = await jsonFile.json();
    CONFIG.AC2D20.WEAPONS.effects = content.effects;
    CONFIG.AC2D20.WEAPONS.qualities = content.qualities;

    for await (const key of Object.keys(content.effects)){
        let qEnriched = await TextEditor.enrichHTML(content.effects[key], {async: true});
        content.effects[key] = qEnriched.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    }

    for await (const key of Object.keys(content.qualities)){
        let qEnriched = await TextEditor.enrichHTML(content.qualities[key], {async: true});
        content.qualities[key] = qEnriched.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    }

})


Hooks.on('renderChatMessage', (message, html, data) => {
    let rrlBtn = html.find('.reroll-button');
    if (rrlBtn.length > 0) {
        rrlBtn[0].setAttribute('data-messageId', message.id);
        rrlBtn.click((el) => {
            //let selectedDiceForReroll = $(el.currentTarget).parent().find('.dice-selected');
            let selectedDiceForReroll = html.find('.dice-selected');
            let rerollIndex = [];
            for (let d of selectedDiceForReroll) {
                rerollIndex.push($(d).data('index'));
            }
            if (!rerollIndex.length) {
                ui.notifications.notify('Select Dice you want to Reroll');
            }
            else {
                let ac2d20Roll = message.flags.ac2d20roll;
                if (ac2d20Roll.diceFace == "d20") {
                    Roller2D20.rerollD20({
                        rollname: ac2d20Roll.rollname,
                        rerollIndexes: rerollIndex,
                        successTreshold: ac2d20Roll.successTreshold,
                        critTreshold: ac2d20Roll.critTreshold,
                        complicationTreshold: ac2d20Roll.complicationTreshold,
                        dicesRolled: ac2d20Roll.dicesRolled
                    });
                } else if (ac2d20Roll.diceFace == "d6") {
                    Roller2D20.rerollD6({
                        rollname: ac2d20Roll.rollname,
                        rerollIndexes: rerollIndex,
                        dicesRolled: ac2d20Roll.dicesRolled,
                        itemId: message.flags.itemId,
                        actorId: message.flags.actorId,
                    });
                } else {
                    ui.notifications.notify('No dice face reckognized');
                }

            }
        })
    }
    html.find('.dice-icon').click((el) => {
        //if ($(el.currentTarget).hasClass('reroll'))
        //return;
        if ($(el.currentTarget).hasClass('dice-selected')) {
            $(el.currentTarget).removeClass('dice-selected');
        } else {
            $(el.currentTarget).addClass('dice-selected')
        }
    });
    let addBtn = html.find('.add-button');
    if (addBtn.length > 0) {
        addBtn[0].setAttribute('data-messageId', message.id);
        addBtn.click((ev) => {
            let ac2d20Roll = message.flags.ac2d20roll;
            let itemId = message.flags.itemId;
            let actorId = message.flags.actorId;
            game.ac2d20.DialogD6.createDialog({ rollname: ac2d20Roll.rollname, diceNum: 1, ac2d20Roll: ac2d20Roll, itemId: itemId, actorId: actorId })
        });
    }

});



/* -------------------------------------------- */
/*  DICE SO NICE                                */
/* -------------------------------------------- */

Hooks.once("diceSoNiceReady", (dice3d) => {
    dice3d.addSystem(
        { id: "ac2d20", name: "Achtung Cthulhu 2d20" },
        true
    );

    dice3d.addColorset(
        {
            name: "ac2d20",
            description: "Achtung Cthulhu 2d20",
            category: "Colors",
            foreground: "#000000",
            background: "#000000",
            outline: "#000000",
            texture: "none",
        }
    );

    dice3d.addDicePreset({
        type: "ds",
        labels: [
            "systems/ac2d20/assets/dice/d1.webp",
            "systems/ac2d20/assets/dice/d2.webp",
            "systems/ac2d20/assets/dice/d3.webp",
            "systems/ac2d20/assets/dice/d4.webp",
            "systems/ac2d20/assets/dice/d5.webp",
            "systems/ac2d20/assets/dice/d6.webp",
        ],
        system: "ac2d20",
        colorset: "ac2d20"
    });
});
