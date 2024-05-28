
/**
 * Extend the base Actor document by defining a custom roll data structure which
 * is ideal for the Simple system.
 * @extends {Actor}
 */
export default class ACActor extends Actor {

	_calculateAttributeBonuses() {
		for (const attribute of Object.keys(this.system.attributes)) {
			const value = this.system.attributes[attribute].value;

			let bonus = 0;

			if (value === 9) bonus = 1;
			if (value >=10 && value <= 11) bonus = 2;
			if (value >=12 && value <= 13) bonus = 3;
			if (value >=14 && value <= 15) bonus = 4;
			if (value >=16) bonus = 5;

			this.system.attributes[attribute].bonus = bonus;
		}
	}


	_calculateCarryCapacity() {
		const brawn = this.system.attributes?.bra?.value ?? 0;

		let carryCapacity = 6;

		if (brawn < 9) {
			carryCapacity = 6;
		}
		else if (brawn === 9) {
			carryCapacity = 7;
		}
		else if (brawn === 10 || brawn === 11) {
			carryCapacity = 8;
		}
		else if (brawn >= 12) {
			carryCapacity = 9;
		}

		this.system.carryCapacity.value = carryCapacity;
	}


	/**
	 * Update the character's count of treated and untreated injuries
	 */
	_calculateCharacterInjuryValues() {
		const injuries = [
			this.system.injuries.injury0,
			this.system.injuries.injury1,
			this.system.injuries.injury2,
		];

		let treated = 0;
		let untreated = 0;

		for (const injury of injuries) {
			if (injury.text !== "" && !injury.treated) untreated++;
			if (injury.text !== "" && injury.treated) treated++;
		}

		this.system.injuries.value = untreated;
		this.system.injuries.treated = treated;
	}


	_calculateMaxStress() {
		const brawn = this.system.attributes?.bra?.value ?? 0;
		const will = this.system.attributes?.will?.value ?? 0;

		const fatigue = this.system.fatigue ?? 0;

		const mod = this.system.stress?.mod ?? 0;
		const resilienceSkillName = game.i18n.localize("AC2D20.SKILL.RESILIENCE");

		const resilienceSkill = this.items.find(
			i => i.type === "skill" && i.name === resilienceSkillName
		);

		if (!resilienceSkill) {
			return ac2d20.logger.error(
				`Unable to locate '${resilienceSkillName}' skill on character ${this.name}`
			);
		}

		const resilience = resilienceSkill.system.value;

		const resiliancePlusBrawn = Math.max(0, resilience + brawn + mod - fatigue);
		const resiliancePlusWill = Math.max(0, resilience + will + mod - fatigue);

		this.system.stress.max = Math.max(resiliancePlusBrawn, resiliancePlusWill);

		if (this.system.stress.value > this.system.stress.max) {
			this.system.stress.value = this.system.stress.max;
		}
	}


	/**
     * Prepare character roll data.
     */
	_getCharacterRollData(data) {
		if (this.type !== "character") return;

		// Copy the ability scores to the top level, so that rolls can use
		// formulas like `@bra.value + 4`.
		if (data.attributes) {
			for (let [k, v] of Object.entries(data.attributes)) {
				data[k] = foundry.utils.deepClone(v);
			}
		}
	}


	/**
     * Prepare NPC roll data.
     */
	_getNpcRollData(data) {}


	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		// Set some Token defaults
		//
		const prototypeToken = {
			actorLink: false,
			disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
			name: data.name, // Set token name to actor name
			sight: {
				enabled: true,
			},
			texture: foundry.utils.duplicate(this.prototypeToken.texture),
		};

		if (this.type === "character") {
			prototypeToken.actorLink = true;
			prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
		}

		if (this.type === "vehicle") {
			prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.NEUTRAL;
		}

		const update = {prototypeToken};
		if (!data.img) {
			const image = CONFIG.AC2D20.DEFAULT_TOKENS[data.type] ?? undefined;

			if (image) {
				update.img = image;
				update.prototypeToken.texture = {
					src: image,
				};
			}
		}

		// Add default Skills to Characters if necessary
		//
		if (this.type === "character") {
			// If the Actor data already contains skill items then this is an
			// Actor being duplicated and we don't want to touch their
			// items at all
			//
			const alreadyHasSkills = Array.isArray(data.items)
				&& data.items.filter(i => i.type === "skill").length > 0;

			if (!alreadyHasSkills) {
				let skillsCompendium = game.settings.get(
					"ac2d20", "compendium-skills"
				);

				if (!skillsCompendium) skillsCompendium = "ac2d20.skills";

				const packSkills = await game.packs.get(skillsCompendium).getDocuments();

				update.items = this.items.map(i => i.toObject());

				packSkills.forEach(s => {
					update.items.push(s.toObject());
				});
			}
		}

		await this.updateSource(update);
	}


	/**
     * Prepare Character type specific data
     */
	_prepareCharacterData(actorData) {
		if (this.type !== "character") return;

		this._calculateAttributeBonuses();
		this._calculateCharacterInjuryValues();
		this._calculateMaxStress();
	}


	/**
     * Prepare NPC type specific data.
     */
	_prepareNpcData(actorData) {
		// if (this.type !== "npc") return;
	}


	/**
     * Override getRollData() that's supplied to rolls.
     */
	getRollData() {
		const data = super.getRollData();
		// Prepare character roll data.
		this._getCharacterRollData(data);
		this._getNpcRollData(data);
		return data;
	}


	/** @override */
	prepareBaseData() {
		// Data modifications in this step occur before processing embedded
		// documents or derived data.
		this._calculateCarryCapacity();
	}


	/** @override */
	prepareData() {
		super.prepareData();
	}


	/**
     * @override
     * Augment the basic actor data with additional dynamic data. Typically,
     * you'll want to handle most of your calculated/derived data in this step.
     * Data calculated in this step should generally not exist in template.json
     * (such as ability modifiers rather than ability scores) and should be
     * available both inside and outside of character sheets (such as if an actor
     * is queried and has a roll executed directly from it).
     */
	prepareDerivedData() {
		this._prepareCharacterData(this);
		this._prepareNpcData(this);
	}

}
