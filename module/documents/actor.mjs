
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ACActor extends Actor {

    /** @override */
    prepareData() {
        super.prepareData();
    }

    /** @override */
    prepareBaseData() {
        // Data modifications in this step occur before processing embedded
        // documents or derived data.    
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
        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags.ac2d20 || {};

        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.
        this._prepareCharacterData(actorData);
        this._prepareNpcData(actorData);
    }

    /**
     * Prepare Character type specific data
     */

    // CHARACTER
    _prepareCharacterData(actorData) {
        if (actorData.type !== 'character') return;
        const data = actorData.data;
        // this._calculateCharacterBodyResistance(actorData);
        //data.favoriteWeapons = actorData.items.filter(i => i.type == 'weapon' && i.data.data.favorite);
        // Encumbrance
        // data.carryWeight.base = 150 + (parseInt(this.data.data.attributes.str.value) * 10);
        // data.carryWeight.value = parseInt(data.carryWeight.base) + parseInt(data.carryWeight.mod);
        // data.totalWeight = this._getItemsTotalWeight();
        // data.encumbranceLevel = 0;
        //if (data.totalWeight > data.carryWeight.value) {
        // let dif = data.totalWeight - data.carryWeight.value;
        // data.encumbranceLevel = Math.ceil(dif / 50);
        // }



    }

    // Calculate Total Weight Of Items
    _getItemsTotalWeight() {
        let physicalItems = this.items.filter(i => {
            return (!i.data.data.stashed && i.data.data.weight != null)
        });
        // remove powered powerArmor pieces for characters
        if (this.data.type == 'character') {
            physicalItems = physicalItems.filter(i => {
                if (i.data.data.appareltype == "powerArmor") {
                    if (!i.data.data.powered)
                        return i;
                } else {
                    return i;
                }
            });
        }
        let physicalItemsMap = physicalItems.map(i => i.data.toObject());
        let totalWeight = 0;
        for (let i of physicalItemsMap) {
            totalWeight += parseInt(i.data.weight);
        }
        return totalWeight;

    }



    /**
     * Prepare NPC type specific data.
     */
    _prepareNpcData(actorData) {
        if (actorData.type !== 'npc') return;

        // Make modifications to data here. For example:
        const data = actorData.data;
        data.xp = (data.cr * data.cr) * 100;
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

    /**
     * Prepare character roll data.
     */
    _getCharacterRollData(data) {
        if (this.data.type !== 'character' || this.data.type !== 'robot') return;
        // Copy the ability scores to the top level, so that rolls can use
        // formulas like `@str.mod + 4`.
        if (data.attributes) {
            for (let [k, v] of Object.entries(data.attributes)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }

        // Add level for easier access, or fall back to 0.
        if (data.level) {
            data.lvl = data.level.value ?? 0;
        }
    }

    /**
     * Prepare NPC roll data.
     */
    _getNpcRollData(data) {
        if (this.data.type !== 'npc') return;

        // Process additional NPC data here.
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        // Setup Tokens
        if (this.type === 'character' || this.type === 'robot') {
            this.data.token.update({ vision: true, actorLink: true, disposition: 1 });
        }

        if (this.type === 'creature') {
            this.data.token.update({ disposition: -1 });
        }

        // Add Skills to Characters and Robots
        if (this.type === 'character' || this.type === 'robot') {
            let packSkills = await game.packs.get('ac2d20.skills').getDocuments();
            const items = this.items.map(i => i.toObject());
            packSkills.forEach(s => {
                items.push(s.toObject());
            });
            this.data.update({ items });
        }
    }

}