
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
        
        // Carry capacity
        let carryCapacity = 6;
        if(this.system.attributes.bra.value < 9){
            carryCapacity = 6
        }else if(this.system.attributes.bra.value == 9){
            carryCapacity = 7
        }
        else if(this.system.attributes.bra.value == 10 || this.system.attributes.bra.value == 11){
            carryCapacity = 8
        }else{
            carryCapacity = 9
        }
        this.system.carryCapacity.value = parseInt(carryCapacity)
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
        // Make separate methods for each Actor type (character, npc, etc.) to keep
        // things organized.
        this._prepareCharacterData(this);
        this._prepareNpcData(this);
    }

    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData(actorData) {
        if (this.type !== 'character') return;        
    }    

    /**
     * Prepare NPC type specific data.
     */
    _prepareNpcData(actorData) {
        if (this.type !== 'npc') return;        
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
        if (this.type !== 'character') return;
        // Copy the ability scores to the top level, so that rolls can use
        // formulas like `@bra.value + 4`.
        if (data.attributes) {
            for (let [k, v] of Object.entries(data.attributes)) {
                data[k] = foundry.utils.deepClone(v);
            }
        }
    }

    getComplicationFromInjuries() {
        const injuries = [this.system.injuries.injury0, this.system.injuries.injury1, this.system.injuries.injury2]
        let inj = injuries.filter((_i) => {
            return (_i.text != "" && !_i.treated)
        })
        return inj.length;
    }

    /**
     * Prepare NPC roll data.
     */
    _getNpcRollData(data) {
        if (this.type !== 'npc') return;
        // Process additional NPC data here.
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        // set icon based on actor type    
        if(data.img == undefined){  
            let ico = `systems/ac2d20/assets/doc-icons/${this.type}.svg`;
            this.updateSource({ 'img': ico });
        }
        // Setup Tokens
        if (this.type === 'character') {
            this.prototypeToken.updateSource({ actorLink: true, sight: { enabled: true }, disposition: 1 })
        }
        if (this.type === 'npc') {
            this.prototypeToken.updateSource({ sight: { enabled: true }, disposition: -1 })
        }
        if (this.type === 'vehicle') {
            this.prototypeToken.updateSource({ sight: { enabled: true }, disposition: 0 })
        }
        // Add Skills to Characters
        if (this.type === 'character') {
            const packName = game.settings.get('ac2d20', 'compendium-skills');
            if(!packName)
                packName = "ac2d20.skills"
                
            let packSkills = await game.packs.get(packName).getDocuments();
            const items = this.items.map(i => i.toObject());
            packSkills.forEach(s => {
                items.push(s.toObject());
            });
            this.updateSource({ items });
        }
    }

    getRollShortcuts() {
        let out = {};
        // Attributes
        for (const name of ["bra", "agi", "coo", "rea", "ins", "wil"]) {
            out[name.substring(0, 3)] = this.system.attributes[name].value;
        }
        // Power
        out['pow'] = this.system.power.value;
        return out;
    }
}