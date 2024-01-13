import ACActorSheet from "./ACActorSheet.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ACActorSheet}
 */
export default class ACVehicleSheet extends ACActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["ac2d20", "sheet", "actor"],
			template: "systems/ac2d20/templates/actor/vehicle-sheet.hbs",
			width: 550,
			height: 550,
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "abilities",
			}],
		});
	}
}
