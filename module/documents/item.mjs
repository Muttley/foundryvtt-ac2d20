/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ACItem extends Item {
    
    /** @override */
    prepareData() {       
        super.prepareData();
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        let ico = `systems/ac2d20/assets/doc-icons/${data.type}.svg`;
        this.updateSource({ 'img': ico });
    }

    /**
     * Prepare a data object which is passed to any Roll formulas which are created related to this Item
     * @private
     */
    getRollData() {
        // If present, return the actor's roll data.
        if (!this.actor) return null;
        const rollData = this.actor.getRollData();
        rollData.item = foundry.utils.deepClone(this.system);

        return rollData;
    }

    // FOCUS
    async addFocus() {
        let focuses = this.system.focuses;
        const focus = { title: '', isfocus: false, description: '' }
        focuses = [...focuses, focus];
        let updatedItem = { _id: this.id, "system.focuses": focuses  };
        await this.update(updatedItem);
    }
    async deleteFocus(_index) {
        console.log(_index)
        let focuses = this.system.focuses;
        focuses.splice(_index, 1);
        let updatedItem = { _id: this.id, "system.focuses": focuses } ;
        await this.update(updatedItem);
    }
    async updateFocuses(_focuses) {
        let updatedItem = { _id: this.id, "system.focuses": _focuses };
        await this.update(updatedItem);
    }
    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    async roll() {
        // Initialize chat data
        const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        const rollMode = game.settings.get('core', 'rollMode');
        const label = `[${this.type}] ${this.name}`;

        // If there's no roll data, send a chat message.
        if (!this.system.formula) {
            ChatMessage.create({
                speaker: speaker,
                rollMode: rollMode,
                flavor: label,
                content: this.system.description ?? ''
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
        const itemData = duplicate(this.system);
        itemData._id = this._id;
        itemData.img = this.img;
        itemData.name = this.name;
        itemData.type = this.type;
        itemData.isPhysical = this.system.hasOwnProperty('weight')
        itemData.isWeapon = this.type === "weapon";
        itemData.isArmor = this.type === "armor";
        itemData.isTalent = this.type === "talent";
        itemData.isSpell = this.type === "spell";
        itemData.isSkillkit = this.type === "skillkit";
        itemData.isSkillkit = this.type === "skillkit";
        itemData.isEquipment = this.type === "equipment";
        itemData.isSpecial_rule = this.type === "special_rule";
        itemData.isSkill = this.type === "skill";
        const html = await renderTemplate("systems/ac2d20/templates/chat/item.html", itemData);
        const chatData = {
            user: game.user.id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperIDs("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        ChatMessage.create(chatData);
    }
}
