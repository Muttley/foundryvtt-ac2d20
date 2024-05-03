import { AC2D20, SYSTEM_ID, SYSTEM_NAME } from "../config.mjs";

import * as apps from "../apps/_module.mjs";
import * as documents from "../documents/_module.mjs";
import * as sheets from "../sheets/_module.mjs";

import { preloadHandlebarsTemplates } from "../templates.mjs";
import { registerHandlebarsHelpers } from "../handlebars.mjs";
import { registerSettings } from "../settings.mjs";
import { registerTextEditorEnrichers } from "../enrichers.mjs";

import Dialog2d20 from "../roller/Dialog2d20.mjs";
import DialogD6 from "../roller/DialogD6.mjs";
import DieACChallenge from "../roller/DieACChallenge.mjs";
import Roller2D20 from "../roller/Roller2D20.mjs";

import ACUtils from "../utils/ACUtils.mjs";
import Logger from "../utils/Logger.mjs";

import { ACHooks } from "../system/ACHooks.mjs";

export async function initHook() {
	console.debug(`${SYSTEM_NAME} | Running init hook`);

	// Add custom constants for configuration.
	CONFIG.AC2D20 = AC2D20;

	globalThis.SYSTEM_ID = SYSTEM_ID;
	globalThis.SYSTEM_NAME = SYSTEM_NAME;

	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	globalThis.ac2d20 = game.ac2d20 = {
		Dialog2d20,
		DialogD6,
		logger: Logger,
		MomentumTracker: apps.MomentumTracker,
		Roller2D20,
		utils: ACUtils,
	};

	/**
   * Set an initiative formula for the system
   * @type {String}
   */
	CONFIG.Combat.initiative = {
		formula: "1",
		decimals: 0,
	};

	// Register custom system settings
	registerSettings();

	registerDocumentClasses();
	registerDocumentSheets();

	CONFIG.Dice.terms.s = DieACChallenge;

	// Combat tracker stuff
	CONFIG.ui.combat = apps.CombatTracker2d20;

	// Register text enrichers.
	registerHandlebarsHelpers();
	registerTextEditorEnrichers();

	preloadHandlebarsTemplates();

	ACHooks.attach();
}


function registerDocumentClasses() {
	// Define custom Document classes
	CONFIG.Actor.documentClass = documents.ACActor;
	CONFIG.Item.documentClass = documents.ACItem;
	CONFIG.Combat.documentClass = documents.Combat2d20;
}

function registerDocumentSheets() {
	Actors.unregisterSheet("core", ActorSheet);
	Items.unregisterSheet("core", ItemSheet);

	Actors.registerSheet("ac2d20",
		sheets.ACActorSheet,
		{
			makeDefault: true,
			types: ["character"],
		}
	);

	Actors.registerSheet("ac2d20",
		sheets.ACNPCSheet,
		{
			makeDefault: true,
			types: ["npc"],
		}
	);

	Actors.registerSheet("ac2d20",
		sheets.ACVehicleSheet,
		{
			makeDefault: true,
			types: ["vehicle"],
		}
	);

	Items.registerSheet("ac2d20",
		sheets.ACItemSheet,
		{
			makeDefault: true,
		}
	);
}

