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

AC2D20.JOURNAL_UUIDS = {
	releaseNotes: "Compendium.ac2d20.system-documentation.JournalEntry.Q2jykbXOXgzNpcSR.JournalEntryPage.g6JENp97aKkuNFcs",
};

AC2D20.Size = ["Trivial", "Minor", "Major"];

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


