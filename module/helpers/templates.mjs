/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    "systems/ac2d20/templates/actor/parts/actor-header.html",
    "systems/ac2d20/templates/actor/parts/actor-attributes.html",
    "systems/ac2d20/templates/actor/parts/actor-skills.html",
    "systems/ac2d20/templates/actor/parts/actor-perks.html",
    "systems/ac2d20/templates/actor/parts/actor-apparel.html",
    "systems/ac2d20/templates/actor/parts/actor-weapons.html",
    "systems/ac2d20/templates/actor/parts/actor-status.html",
    "systems/ac2d20/templates/actor/parts/actor-effects.html",
    "systems/ac2d20/templates/actor/parts/actor-equipped_apparel.html",
    "systems/ac2d20/templates/actor/parts/actor-favorite_weapons.html",
    "systems/ac2d20/templates/actor/parts/actor-conditions.html",
    "systems/ac2d20/templates/actor/parts/actor-inventory.html",
    "systems/ac2d20/templates/actor/parts/actor-special_abilities.html",
    "systems/ac2d20/templates/actor/parts/body-status-plaque.html",
    "systems/ac2d20/templates/item/parts/item-header.html",
    "systems/ac2d20/templates/item/parts/item-effects.html",
    "systems/ac2d20/templates/actor/parts/simple-expandable-item.html"
  ]);
};
