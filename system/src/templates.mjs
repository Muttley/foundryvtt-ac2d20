/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
	return loadTemplates([
		"systems/ac2d20/templates/actor/parts/actor-header.hbs",
		"systems/ac2d20/templates/actor/parts/actor-abilities.hbs",
		"systems/ac2d20/templates/actor/parts/actor-armor.hbs",
		"systems/ac2d20/templates/actor/parts/actor-effects.hbs",
		"systems/ac2d20/templates/actor/parts/actor-encumbrance.hbs",
		"systems/ac2d20/templates/actor/parts/actor-equipment.hbs",
		"systems/ac2d20/templates/actor/parts/actor-skillkit.hbs",
		"systems/ac2d20/templates/actor/parts/actor-spells.hbs",
		"systems/ac2d20/templates/actor/parts/actor-talents.hbs",
		"systems/ac2d20/templates/actor/parts/actor-weapons.hbs",
		"systems/ac2d20/templates/actor/parts/npc-abilities.hbs",
		"systems/ac2d20/templates/actor/parts/npc-header.hbs",
		"systems/ac2d20/templates/actor/parts/simple-expandable-item.hbs",
		"systems/ac2d20/templates/actor/parts/vehicle-abilities.hbs",
		"systems/ac2d20/templates/actor/parts/vehicle-header.hbs",
		"systems/ac2d20/templates/item/parts/item-effects.hbs",
		"systems/ac2d20/templates/item/parts/item-header.hbs",
	]);
};
