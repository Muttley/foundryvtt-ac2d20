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

AC2D20.VEHICLE_QUALITIES = {
	cargo_x: "AC2D20.VEHICLES.QUALITIES.cargo_x",
	cumbersome: "AC2D20.VEHICLES.QUALITIES.cumbersome",
	enclosed: "AC2D20.VEHICLES.QUALITIES.enclosed",
	exposed: "AC2D20.VEHICLES.QUALITIES.exposed",
	high_performance: "AC2D20.VEHICLES.QUALITIES.high_performance",
	single_seat: "AC2D20.VEHICLES.QUALITIES.single_seat",
	tough_x: "AC2D20.VEHICLES.QUALITIES.tough_x",
};

AC2D20.WEAPON_QUALITIES = {
	accurate: "AC2D20.WEAPONS.weaponQuality.accurate",
	bane: "AC2D20.WEAPONS.weaponQuality.bane",
	close_quarters: "AC2D20.WEAPONS.weaponQuality.close_quarters",
	cumbersome: "AC2D20.WEAPONS.weaponQuality.cumbersome",
	debilitating: "AC2D20.WEAPONS.weaponQuality.debilitating",
	escalation: "AC2D20.WEAPONS.weaponQuality.escalation",
	giant_killer: "AC2D20.WEAPONS.weaponQuality.giant_killer",
	heavy: "AC2D20.WEAPONS.weaponQuality.heavy",
	hidden: "AC2D20.WEAPONS.weaponQuality.hidden",
	hunger: "AC2D20.WEAPONS.weaponQuality.hunger",
	inaccurate: "AC2D20.WEAPONS.weaponQuality.inaccurate",
	indirect: "AC2D20.WEAPONS.weaponQuality.indirect",
	munition: "AC2D20.WEAPONS.weaponQuality.munition",
	parrying: "AC2D20.WEAPONS.weaponQuality.parrying",
	reliable: "AC2D20.WEAPONS.weaponQuality.reliable",
	subtle: "AC2D20.WEAPONS.weaponQuality.subtle",
	unreliable: "AC2D20.WEAPONS.weaponQuality.unreliable",
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

export async function generateEnrichedTooltips() {
	// Damage Effects
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

	// Vehicle Qualities
	CONFIG.AC2D20.VEHICLE_QUALITY_HAS_RANK = {};
	CONFIG.AC2D20.VEHICLE_QUALITY_TOOLTIPS = [];
	for (const key in CONFIG.AC2D20.VEHICLE_QUALITIES) {
		CONFIG.AC2D20.VEHICLE_QUALITY_TOOLTIPS[key] = await TextEditor.enrichHTML(
			game.i18n.localize(
				`AC2D20.Tooltips.VehicleQuality.${key}`
			)
		);
		CONFIG.AC2D20.VEHICLE_QUALITY_HAS_RANK[key] = key.endsWith("_x");
	}

	// Weapon Qualities
	CONFIG.AC2D20.WEAPON_QUALITY_TOOLTIPS = {};
	for (const key in CONFIG.AC2D20.WEAPON_QUALITIES) {
		CONFIG.AC2D20.WEAPON_QUALITY_TOOLTIPS[key] = await TextEditor.enrichHTML(
			game.i18n.localize(
				`AC2D20.Tooltips.WeaponQuality.${key}`
			)
		);
	}
}

export async function prepareSkills() {
	let packSkills = await game.packs.get("ac2d20.skills").getDocuments();

	let _skills = [];

	packSkills.forEach(s => {

		_skills.push({
			focuses: s.system.focuses.map(f => f.title),
			key: s.name,
			label: game.i18n.localize(`AC2D20.SKILL.${s.name.toUpperCase()}`),
		});
	});

	CONFIG.AC2D20.SKILLS = _skills.sort((a, b) => a.key.localeCompare(b.key));
}
