/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export default class ACItem extends Item {

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);
		if (data.img === undefined) {
			let ico = `systems/ac2d20/assets/doc-icons/${data.type}.svg`;
			this.updateSource({ img: ico });
		}
	}


	async addFocus() {
		let focuses = this.system.focuses;
		const focus = { title: "", isfocus: false, description: "" };
		focuses = [...focuses, focus];
		let updatedItem = { "_id": this.id, "system.focuses": focuses  };
		await this.update(updatedItem);
	}


	async deleteFocus(_index) {
		let focuses = this.system.focuses;
		focuses.splice(_index, 1);
		let updatedItem = { "_id": this.id, "system.focuses": focuses };
		await this.update(updatedItem);
	}


	/**
     * Prepare a data object which is passed to any Roll formulas which are
	 * created related to this Item
     * @private
     */
	getRollData() {
		// If present, return the actor's roll data.
		if (!this.actor) return null;
		const rollData = this.actor.getRollData();
		rollData.item = foundry.utils.deepClone(this.system);

		return rollData;
	}


	/** @override */
	prepareData() {
		super.prepareData();
	}


	/**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
	async roll() {
		// Initialize chat data
		const speaker = ChatMessage.getSpeaker({ actor: this.actor });
		const rollMode = game.settings.get("core", "rollMode");
		const label = `[${this.type}] ${this.name}`;

		// If there's no roll data, send a chat message.
		if (!this.system.formula) {
			ChatMessage.create({
				speaker: speaker,
				rollMode: rollMode,
				flavor: label,
				content: this.system.description ?? "",
			});
		}
		// Otherwise, create a roll and send a chat message from it.
		else {
			// Retrieve roll data.
			const rollData = this.getRollData();

			// Invoke the roll and submit it to chat.
			const roll = new Roll(rollData.item.formula, rollData).roll();
			roll.toMessage({
				speaker: speaker,
				rollMode: rollMode,
				flavor: label,
			});
			return roll;
		}
	}


	async sendToChat() {
		const itemData = foundry.utils.duplicate(this.system);

		itemData._id = this._id;
		itemData.img = this.img;
		itemData.isArmor = this.type === "armor";
		itemData.isEquipment = this.type === "equipment";
		itemData.isPhysical = this.system.hasOwnProperty("weight");
		itemData.isSkill = this.type === "skill";
		itemData.isSkillkit = this.type === "skillkit";
		itemData.isSpecial_rule = this.type === "special_rule";
		itemData.isSpell = this.type === "spell";
		itemData.isTalent = this.type === "talent";
		itemData.isWeapon = this.type === "weapon";
		itemData.name = this.name;
		itemData.type = this.type;

		const html = await foundry.applications.handlebars.renderTemplate(
			"systems/ac2d20/templates/chat/item.hbs",
			itemData
		);

		const chatData = {
			user: game.user.id,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
		};

		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		}
		else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}

		ChatMessage.create(chatData);
	}

}
