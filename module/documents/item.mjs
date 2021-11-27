/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ACItem extends Item {
    /**
     * Augment the basic Item data model with additional dynamic data.
     */
    prepareData() {
        // As with the actor class, items are documents that can have their data
        // preparation methods overridden (such as prepareBaseData()).
        super.prepareData();
    }

    // async _preCreate(data, options, user) {
    //   await super._preCreate(data, options, user);
    //   if (data.type == "weapon") {
    //     let flags = {};
    //     flags['ac2d20.weaponQualities'] = duplicate(CONFIG.AC2D20.WEAPONS.weaponQuality);
    //     flags['ac2d20.damageEffects'] = duplicate(CONFIG.AC2D20.WEAPONS.damageEffect);
    //     this.data.update({ 'flags': flags });
    //   }
    // }

    /**
     * Prepare a data object which is passed to any Roll formulas which are created related to this Item
     * @private
     */
    getRollData() {
        // If present, return the actor's roll data.
        if (!this.actor) return null;
        const rollData = this.actor.getRollData();
        rollData.item = foundry.utils.deepClone(this.data.data);

        return rollData;
    }

    // FOCUS
    async addFocus() {
        let focuses = this.data.data.focuses;
        const focus = { title: '', isfocus: false }
        focuses = [...focuses, focus];
        let updatedItem = { _id: this.id, data: { focuses: focuses } };
        await this.update(updatedItem);
    }
    async deleteFocus(_index) {
        console.log(_index)
        let focuses = this.data.data.focuses;
        focuses.splice(_index, 1);
        let updatedItem = { _id: this.id, data: { focuses: focuses } };
        await this.update(updatedItem);
    }
    async updateFocuses(_focuses) {
        let updatedItem = { _id: this.id, data: { focuses: _focuses } };
        await this.update(updatedItem);
    }
    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    async roll() {
        const item = this.data;

        // Initialize chat data.
        const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        const rollMode = game.settings.get('core', 'rollMode');
        const label = `[${item.type}] ${item.name}`;

        // If there's no roll data, send a chat message.
        if (!this.data.data.formula) {
            ChatMessage.create({
                speaker: speaker,
                rollMode: rollMode,
                flavor: label,
                content: item.data.description ?? ''
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
}
