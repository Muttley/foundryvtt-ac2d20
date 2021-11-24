// Import document classes.
import { ACActor } from "./documents/actor.mjs";
import { ACItem } from "./documents/item.mjs";
// Import sheet classes.
import { ACActorSheet } from "./sheets/actor-sheet.mjs";
import { ACItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { AC2D20 } from "./helpers/config.mjs";

import DieACChallenge from './roller/challengeDie.js'


Hooks.once('init', async function () {
    // Add utility classes to the global game object so that they're more easily
    // accessible in global contexts.
    console.warn('INIT')
    game.ac2d20 = {
        ACActor,
        ACItem
    };

    // Add custom constants for configuration.
    CONFIG.AC2D20 = AC2D20;

    /**
   * Set an initiative formula for the system
   * @type {String}
   */
    CONFIG.Combat.initiative = {
        formula: "2d20",
        decimals: 0
    };

    // Define custom Document classes
    CONFIG.Actor.documentClass = ACActor;
    CONFIG.Item.documentClass = ACItem;




    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("ac2d20", ACActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("ac2d20", ACItemSheet, { makeDefault: true });

});

Hooks.on('ready', () => {
    console.warn('ready')
    CONFIG.Dice.terms['p'] = DieACChallenge;
    console.warn(CONFIG.Dice.terms)
})

/* -------------------------------------------- */
/*  DICE SO NICE                                */
/* -------------------------------------------- */

// Hooks.once("diceSoNiceReady", (dice3d) => {
//     dice3d.addSystem(
//         { id: "ac2d20", name: "Achtung Cthulhu 2d20" },
//         true
//     );

//     dice3d.addColorset(
//         {
//             name: "ac2d20",
//             description: "Achtung Cthulhu 2d20",
//             category: "Colors",
//             foreground: "#fcef71",
//             background: "#008cd1",
//             outline: "gray",
//             texture: "none",
//         }
//     );

//     dice3d.addDicePreset({
//         type: "dp",
//         labels: [
//             "systems/ac2d20/assets/dice/d1.webp",
//             "systems/ac2d20/assets/dice/d2.webp",
//             "systems/ac2d20/assets/dice/d3.webp",
//             "systems/ac2d20/assets/dice/d4.webp",
//             "systems/ac2d20/assets/dice/d5.webp",
//             "systems/ac2d20/assets/dice/d6.webp",
//         ],
//         system: "ac2d20",
//         colorset: "ac2d20"
//     });
// });