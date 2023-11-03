import { AC2D20 } from "../helpers/config.mjs";
import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";
import { ACActorSheet } from "./actor-sheet.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ACActorSheet}
 */
export class ACVehicleSheet extends ACActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["ac2d20", "sheet", "actor"],
			template: "systems/ac2d20/templates/actor/vehicle-sheet.html",
			width: 550,
			height: 550,
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "abilities" }],
		});
	}
}
