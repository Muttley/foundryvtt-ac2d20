import ACActorSheet from "./ACActorSheet.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ACActorSheet}
 */
export default class ACNPCSheet extends ACActorSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["ac2d20", "sheet", "npc"],
			template: "systems/ac2d20/templates/actor/npc-sheet.hbs",
			width: 550,
			height: 780,
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "abilities",
			}],
		});
	}
}
