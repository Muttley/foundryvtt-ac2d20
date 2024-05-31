/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
	const partials = [
		"systems/ac2d20/templates/actor/_shared-partials/weapon-details-hint.hbs",
		"systems/ac2d20/templates/actor/parts/actor-abilities.hbs",
		"systems/ac2d20/templates/actor/parts/actor-armor.hbs",
		"systems/ac2d20/templates/actor/parts/actor-effects.hbs",
		"systems/ac2d20/templates/actor/parts/actor-encumbrance.hbs",
		"systems/ac2d20/templates/actor/parts/actor-equipment.hbs",
		"systems/ac2d20/templates/actor/parts/actor-header.hbs",
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
	];

	const paths = {};
	for (const path of partials) {
		const [key] = path.split("/").slice(3).join("/").split(".");
		paths[key] = path;
	}

	return loadTemplates(paths);
};
