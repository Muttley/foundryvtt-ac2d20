import { ACUpdateBase } from "../ACUpdateBase.mjs";

export default class Update_240531_2 extends ACUpdateBase {
	static version = 240531.2;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "skill" || !actorData) return;
		if (game.settings.get("core", "language") === "en") return;

		const languageLut = await this._generateLanguageLut();

		const updateData = {};

		const fixedSkillName = languageLut.skill[itemData.name] ?? itemData.name;
		if (itemData.name !== fixedSkillName) {
			updateData.name = fixedSkillName;
		}

		const fixedFocuses = [];
		for (const focus of itemData.system.focuses ?? []) {
			focus.title =
				languageLut.focus[focus.title] ?? focus.title;

			fixedFocuses.push(focus);
		}

		updateData["system.focuses"] = fixedFocuses;

		return updateData;
	}

	async _generateLanguageLut() {
		const lut = {
			skill: {},
			focus: {},
		};

		for (const skillName of this.englishSkillNames) {
			const localizedName =
				game.i18n.localize(`AC2D20.SKILL.${skillName.toUpperCase()}`);

			lut.skill[localizedName] = skillName;
		}

		for (const focusName of this.englishFocusNames) {
			const localizedName = game.i18n.localize(`AC2D20.FOCUS.${focusName}`);

			lut.focus[localizedName] = focusName;
		}

		return lut;
	}

	get englishFocusNames() {
		return [
			"Air Force",
			"Aircraft",
			"Animal Handling",
			"Architecture",
			"Army",
			"Art",
			"Camouflage",
			"Cars",
			"Charm",
			"Climbing",
			"Close Quarters",
			"Combat Engineering",
			"Covert Operations",
			"Cryptography",
			"Deceive",
			"Discipline",
			"Disguise",
			"Electronics",
			"Exotic",
			"Explosives",
			"Finance",
			"First Aid",
			"Foraging",
			"Fortitude",
			"Hand-to-Hand",
			"Handguns",
			"Hearing",
			"Heavy Vehicles",
			"Heavy Weapons",
			"History",
			"Hunting",
			"Immunity",
			"Infectious Diseases",
			"Innuendo",
			"Instincts",
			"Intimidation",
			"Invocation",
			"Leadership",
			"Lifting",
			"Linguistics",
			"Mechanical Engineering",
			"Melee Weapons",
			"Motorcycles",
			"Mysticism",
			"Navy",
			"Negotiation",
			"Occultism",
			"Orienteering",
			"Pharmacology",
			"Physical Training",
			"Psychiatry",
			"Rhetoric",
			"Rifles",
			"Running",
			"Rural Stealth",
			"Science",
			"Sight",
			"Smell and Taste",
			"Surgery",
			"Swimming",
			"Tanks",
			"Technical Projects",
			"Threat Awareness",
			"Throwing",
			"Toxicology",
			"Tracking",
			"Urban Stealth",
			"Watercraft",
		];
	}

	get englishSkillNames() {
		return [
			"Academia",
			"Athletics",
			"Engineering",
			"Fighting",
			"Medicine",
			"Observation",
			"Persuasion",
			"Resilience",
			"Stealth",
			"Survival",
			"Tactics",
			"Vehicles",
		];
	}

}
