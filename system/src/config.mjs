export const SYSTEM_ID = "ac2d20";
export const SYSTEM_NAME = "Achtung! Cthulhu 2d20";

export const AC2D20 = {};

AC2D20.attributes = {
	agi: "AC2D20.AbilityAgi",
	bra: "AC2D20.AbilityBra",
	coo: "AC2D20.AbilityCoo",
	ins: "AC2D20.AbilityIns",
	rea: "AC2D20.AbilityRea",
	wil: "AC2D20.AbilityWil",
};

AC2D20.abilityAbbreviations = {
	agi: "AC2D20.AbilityAgiAbr",
	bra: "AC2D20.AbilityBraAbr",
	coo: "AC2D20.AbilityCooAbr",
	ins: "AC2D20.AbilityInsAbr",
	rea: "AC2D20.AbilityReaAbr",
	wil: "AC2D20.AbilityWilAbr",
};

AC2D20.DEFAULT_TOKENS = {
	character: "systems/ac2d20/assets/doc-icons/character.svg",
	npc: "systems/ac2d20/assets/doc-icons/npc.svg",
	vehicle: "systems/ac2d20/assets/doc-icons/vehicle.svg",
};

AC2D20.ITEM_COMPENDIUMS = {};

AC2D20.JOURNAL_UUIDS = {
	releaseNotes: "Compendium.ac2d20.system-documentation.JournalEntry.Q2jykbXOXgzNpcSR",
};

AC2D20.Size = ["Trivial", "Minor", "Major"];

AC2D20.DAMAGE_EFFECTS = {
	area: "AC2D20.WEAPONS.damageEffect.area",
	backlash_x: "AC2D20.WEAPONS.damageEffect.backlash_x",
	drain: "AC2D20.WEAPONS.damageEffect.drain",
	intense: "AC2D20.WEAPONS.damageEffect.intense",
	persistent_x: "AC2D20.WEAPONS.damageEffect.persistent_x",
	piercing_x: "AC2D20.WEAPONS.damageEffect.piercing_x",
	snare: "AC2D20.WEAPONS.damageEffect.snare",
	stun: "AC2D20.WEAPONS.damageEffect.stun",
	vicious: "AC2D20.WEAPONS.damageEffect.vicious",
};

AC2D20.WEAPONS = {
	range: {
		reach: "AC2D20.RANGE.reach",
		close: "AC2D20.RANGE.close",
		medium: "AC2D20.RANGE.medium",
		long: "AC2D20.RANGE.long",
		extreme: "AC2D20.RANGE.extreme",
	},
	weaponTypes: [
		{
			label: "Melee",
			bonusAttribute: "agi",
		},
		{
			label: "Ranged",
			bonusAttribute: "coo",
		},
		{
			label: "Mental",
			bonusAttribute: "wil",
		},
	],
};

AC2D20.spellcastingTypes = {
	traditional: "traditional",
	researcher: "researcher",
	dabbler: "dabbler",
};

export async function buildSkillTranslations() {
	CONFIG.AC2D20.SKILL_NAMES = {};

	const skills = await ac2d20.utils.getSkillsCompendium().getDocuments();

	for (const skill of skills) {
		// Get the localized name of a skill, if there is no
		// localization then it is likely a custom skill, in which
		// case we will just use it's original name
		//
		const nameKey = `AC2D20.SKILL.${skill.name.toUpperCase()}`;
		let localizedName = game.i18n.localize(nameKey);

		if (localizedName === nameKey) localizedName = skill.name;

		CONFIG.AC2D20.SKILL_NAMES[nameKey] = localizedName;
	}
}

export async function generateEnrichedTooltips() {
	// CONFIG.AC2D20.WEAPON_QUALITY_TOOLTIPS = {};
	// CONFIG.AC2D20.WEAPON_QUALITY_HAS_RANK = {};
	// for (const key in CONFIG.AC2D20.WEAPON_QUALITIES) {
	// 	CONFIG.AC2D20.WEAPON_QUALITY_TOOLTIPS[key] = await TextEditor.enrichHTML(
	// 		game.i18n.localize(
	// 			`AC2D20.TOOLTIPS.WeaponQuality.${key}`
	// 		)
	// 	);
	// 	CONFIG.AC2D20.WEAPON_QUALITY_HAS_RANK[key] = key.endsWith("_x");
	// }

	CONFIG.AC2D20.DAMAGE_EFFECT_HAS_RANK = {};
	CONFIG.AC2D20.DAMAGE_EFFECT_TOOLTIPS = [];
	for (const key in CONFIG.AC2D20.DAMAGE_EFFECTS) {
		CONFIG.AC2D20.DAMAGE_EFFECT_TOOLTIPS[key] = await TextEditor.enrichHTML(
			game.i18n.localize(
				`AC2D20.Tooltips.DamageEffect.${key}`
			)
		);
		CONFIG.AC2D20.DAMAGE_EFFECT_HAS_RANK[key] = key.endsWith("_x");
	}
}
