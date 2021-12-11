import { AC2D20 } from "../helpers/config.mjs";
import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ACActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["ac2d20", "sheet", "actor"],
            template: "systems/ac2d20/templates/actor/actor-sheet.html",
            width: 720,
            height: 780,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "abilities" }]
        });
    }

    /** @override */
    get template() {
        return `systems/ac2d20/templates/actor/actor-${this.actor.data.type}-sheet.html`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        // Retrieve the data structure from the base sheet. You can inspect or log
        // the context variable to see the structure, but some key properties for
        // sheets are the actor object, the data object, whether or not it's
        // editable, the items array, and the effects array.
        const context = super.getData();
        // Use a safe clone of the actor data for further operations.
        const actorData = context.actor.data;

        // Add the actor's data to context.data for easier access, as well as flags.
        context.data = actorData.data;
        context.flags = actorData.flags;

        // Prepare character data and items.
        if (actorData.type == 'character') {
            this._prepareItems(context);
            this._prepareCharacterData(context);
        }

        // Prepare NPC data and items.
        if (actorData.type == 'npc') {
            this._prepareItems(context)

        }

        // Prepare Creature data and items.
        if (actorData.type == 'creature') {
            this._prepareItems(context)

        }

        // Add roll data for TinyMCE editors.
        //context.rollData = context.actor.getRollData();

        // Prepare active effects
        context.effects = prepareActiveEffectCategories(this.actor.effects);
        context.AC2D20 = CONFIG.AC2D20;

        return context;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCharacterData(context) {
        // Handle ability scores.
        // for (let [k, v] of Object.entries(context.data.attributes)) {
        //     v.label = game.i18n.localize(CONFIG.AC2D20.attributes[k]) ?? k;
        // }

        //let allInjuries = [];
        //context.treatedInjuriesCount = allInjuries.filter(i => i == 1).length;
        // context.openInjuriesCount = allInjuries.filter(i => i == 2).length;

        let isEncumbered = false;
        let physicalItems = context.items.filter(i => i.data.hasOwnProperty('weight'));
        let encumberingItems = physicalItems.filter((i) => {
            if (i.type != 'armor') {
                return true;
            }
            else {
                if (!i.data.equipped || (i.data.equipped && i.data.qualities.heavy.value)) {
                    return true
                }
            }
        });
        context.minorItemsTotal = encumberingItems.filter(i => parseInt(i.data.weight) === 1).length;
        context.majorItemsTotal = encumberingItems.filter(i => parseInt(i.data.weight) === 3).length;
        let totalEncumbrance = 0;
        for (let i = 0; i < encumberingItems.length; i++) {
            totalEncumbrance += parseInt(encumberingItems[i].data.quantity) * parseInt(encumberingItems[i].data.weight)
        }
        context.totalEncumbrance = totalEncumbrance;
        // REMOVE ARMORS THAT ARE EQUIPPED AND DOESN'T HAVE HEAVY QUALITY FROM CALCULATION
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareItems(context) {
        // Initialize containers.

        const skills = [];
        const talents = [];
        const spells = [];
        const weapons = [];
        const armor = [];
        const skillkits = [];
        const equipment = [];
        const specialRules = []

        // Iterate through items, allocating to containers
        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;
            // Append to gear.
            if (i.type === 'skill') {
                skills.push(i);
            }
            else if (i.type === 'talent') {
                talents.push(i);
            }
            else if (i.type === 'spell') {
                spells.push(i);
            }
            else if (i.type === 'armor') {
                armor.push(i);
            }
            else if (i.type === 'weapon') {
                weapons.push(i);
            }
            else if (i.type === 'skillkit') {
                skillkits.push(i);
            }
            else if (i.type === 'equipment') {
                equipment.push(i);
            }
            else if (i.type === 'special_rule') {
                specialRules.push(i)
            }
        }

        // Assign and return
        // skills.sort(function (a, b) {
        //     var nameA = a.name.toUpperCase();
        //     var nameB = b.name.toUpperCase();
        //     return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
        // });
        context.skills = skills;
        context.talents = talents;
        context.spells = spells;
        context.armor = armor;
        context.skillkits = skillkits;
        context.equipment = equipment;
        context.weapons = weapons;
        context.specialRules = specialRules;


        // WRAP INVENTORY DEPENDING ON THE CHARACTER TYPE:
        // for example put apparel in inventory for all except the character actor.

        // NPC and Creature Inventory = all physical items that are not weapons
        // if (this.actor.type == 'npc' || this.actor.type == 'creature') {
        //     context.inventory = context.items.filter(i => {
        //         return (i.type !== 'weapon' && i.data.weight != null)
        //     });
        // }
        // if (this.actor.type == 'character') {
        //     context.inventory = [...robotApparel, ...robot_mods];
        // }

    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // SWITCH TABS
        html.find('.tab-switch').click((evt) => {
            evt.preventDefault();
            const el = evt.currentTarget;
            const tab = el.dataset.tab;
            this._tabs[0].activate(tab);
        });

        // Render the item sheet for viewing/editing prior to the editable check.
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });

        // -------------------------------------------------------------
        // ! Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // * SKILLS LISTENERS [clic, right-click, value change, focus ]
        // Click Skill Item
        html.find('.roll-skill.clickable, .roll-focus.clickable').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            let isFocused = $(ev.currentTarget).hasClass('focused');
            this._onRollSkill(item.name, item.data.data.value, this.actor.data.data.attributes[item.data.data.defaultAttribute].value, isFocused);
        });
        // Change Skill Rank value
        html.find('.skill-value-input').change(async (ev) => {
            let newRank = parseInt($(ev.currentTarget).val());
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            let updatedItem = { _id: item.id, data: { value: newRank } };
            await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
        });
        // Toggle Focus value
        html.find('.skill .item-skill-focus').click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            let updatedItem = { _id: item.id, data: { focus: !item.data.data.focus } };
            await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
        });
        // * END SKILLS

        // * TRUTHS
        html.find('.truth-text').change(async (ev) => {
            let updates = [];
            $('.truth-cell').each((i, el) => {
                let _txt = this._clearTextAreaText($(el).find('.truth-text').val());
                let truth = {
                    text: _txt
                }
                updates.push(truth);
            });
            await this.actor.update({ 'data.truths': updates });
        });
        // * END TRUTHS

        // * SPELLS GRID
        html.find('.cell-expander').click((event) => { this._onItemSummary(event) });

        html.find('.roll-spell.clickable').click((event) => {
            event.preventDefault();
            const li = $(event.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            let complication = 20 - parseInt(item.data.data.difficulty - 1)
            if (item.actor.data.type == 'character')
                complication -= item.actor.getComplicationFromInjuries();

            if (item.actor.data.type == 'npc')
                complication -= item.actor.data.data.injuries.value;

            const skillName = item.data.data.skill;
            const focusName = item.data.data.focus;
            if (!skillName)
                return;

            const skill = this.actor.items.getName(skillName);
            let skillRank = 0;
            try {
                skillRank = skill.data.data.value;
            } catch (err) { }
            let isFocus = false;
            try {
                for (const [key, value] of Object.entries(skill.data.data.focuses)) {
                    if (value.title === focusName && value.isfocus)
                        isFocus = true;
                }
            } catch (err) { }
            //const attrValue = this.actor.data.data.attributes[item.data.data.spellType].value;
            const attrValue = -1;
            const prefAttribute = item.data.data.spellType;
            game.ac2d20.Dialog2d20.createDialog({ rollName: item.name, diceNum: 2, attribute: attrValue, skill: skillRank, focus: isFocus, complication: complication, actor: this.actor.data.data, prefAttribute: prefAttribute })

        });

        html.find('.roll-spell-cost.clickable').click((event) => {
            event.preventDefault();
            const li = $(event.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            const cost = parseInt(item.data.data.cost);
            game.ac2d20.DialogD6.createDialog({ rollName: item.data.name, diceNum: cost, ac2d20Roll: null })
        })

        // * WEAPON
        html.find('.roll-weapon.clickable').click((event) => {
            event.preventDefault();
            const li = $(event.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            console.warn(item)
            let complication = 20;
            // if unrelliable increase complication
            for (const [k, v] of Object.entries(item.data.data.qualities)) {
                if (v.value && k == 'unreliable')
                    complication -= 1;
            }
            if (item.actor.data.type == 'character')
                complication -= item.actor.getComplicationFromInjuries();

            if (item.actor.data.type == 'npc')
                complication -= item.actor.data.data.injuries.value;

            console.warn(complication);

            const focusName = item.data.data.focus;
            console.warn(focusName);
            if (!focusName)
                return;


            const skill = this.actor.items.getName(item.data.data.skill);
            console.log(skill);
            let skillRank = 0;
            try {
                skillRank = skill.data.data.value;
            } catch (err) {
                console.log(err)
            }
            let isFocus = false;
            try {
                for (const [key, value] of Object.entries(skill.data.data.focuses)) {
                    console.warn(value.title, focusName)
                    if (value.title === focusName && value.isfocus)
                        isFocus = true;
                }
            } catch (err) { console.log(err) }
            const attrValue = -1;
            // weaponType is actualy attribute abrevation
            const prefAttribute = item.data.data.weaponType;
            game.ac2d20.Dialog2d20.createDialog({ rollName: item.name, diceNum: 2, attribute: attrValue, skill: skillRank, focus: isFocus, complication: complication, actor: this.actor.data.data, prefAttribute: prefAttribute })

        });

        html.find('.roll-stress.clickable').click((event) => {
            event.preventDefault();
            const li = $(event.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            console.log(item);
            let stress = parseInt(item.data.data.stress) + parseInt(this.actor.data.data.attributes[item.data.data.weaponType].bonus);
            console.log(stress);
            game.ac2d20.DialogD6.createDialog({ rollName: item.data.name, diceNum: stress, ac2d20Roll: null, weapon: item })
        })

        // * AMMO COUNT UPDATE 
        html.find('.ammo-quantity').change(async (ev) => {
            let newQuantity = parseInt($(ev.currentTarget).val());
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            let updatedItem = { _id: item.id, data: { ammo: newQuantity } };
            await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
        });

        // * RESOURCE COUNT
        html.find('.resources-quantity').change(async (ev) => {
            let newQuantity = parseInt($(ev.currentTarget).val());
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            let updatedItem = { _id: item.id, data: { resources: newQuantity } };
            await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
        });

        // * CLICK TO EXPAND
        html.find(".expandable-info").click((event) => this._onItemSummary(event));

        // * Add Inventory Item
        html.find('.item-create').click(this._onItemCreate.bind(this));

        // * Delete Inventory Item
        html.find('.item-delete').click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            await item.delete();
            li.slideUp(200, () => this.render(false));
        });

        // * Toggle Stash Inventory Item
        html.find(".item-stash").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("item-id"));
            await this.actor.updateEmbeddedDocuments("Item", [this._toggleStashed(li.data("item-id"), item)]);
        });

        // * Toggle Equip Inventory Item
        html.find(".item-toggle").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("item-id"));
            await this.actor.updateEmbeddedDocuments("Item", [this._toggleEquipped(li.data("item-id"), item)]);
        });

        // * Toggle Favorite Inventory Item
        html.find(".item-favorite").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("item-id"));
            await this.actor.updateEmbeddedDocuments("Item", [this._toggleFavorite(li.data("item-id"), item)]);
        });

        // * INJURIES
        html.find('.injury-text, .treated, .injury-type').change(async (ev) => {
            let updates = [];
            $('.injury-cell.injury').each((i, el) => {
                let _txt = this._clearTextAreaText($(el).find('.injury-text').val());
                let inj = {
                    text: _txt,
                    treated: $(el).find('.controls .treated').is(":checked"),
                    injuryType: $(el).find('.controls .injury-type').is(":checked")
                }
                updates.push(inj);
            });
            await this.actor.update({ 'data.injuries.list': updates });
        });
        // * END INJURIES

        // * Active Effect management
        html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));







        // !CRATURES

        // ! DON'T LET NUMBER FIELDS EMPTY
        const numInputs = document.querySelectorAll('input[type=number]');
        numInputs.forEach(function (input) {
            input.addEventListener('change', function (e) {
                if (e.target.value == '') {
                    e.target.value = 0
                }
            })
        });
    }

    // * UTILS
    _clearTextAreaText(txt) {
        txt.trim();
        txt = txt.replace(/  +/g, ' ');
        //! replace new lines with encided \n so stupid textarea doesn't break
        txt = txt.replace(/(?:\r\n|\r|\n)/g, '&#13;&#10;');
        return txt;
    };

    /**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event   The originating click event
     * @private
     */
    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        // Get the type of item to create.
        const type = header.dataset.type;
        // Grab any data associated with this control.
        const data = duplicate(header.dataset);
        // Initialize a default name.
        const name = `New ${type.capitalize()}`;
        // Prepare the item object.   
        const itemData = {
            name: name,
            type: type,
            data: data
        };
        // Remove the type from the dataset since it's in the itemData.type prop.
        delete itemData.data["type"];
        // Finally, create the item!
        return await Item.create(itemData, { parent: this.actor });
    }

    async _onRightClickDelete(itemId) {
        const item = this.actor.items.get(itemId);
        await item.delete();
        //li.slideUp(200, () => this.render(false));
    }

    _onRightClickSkill(itemId, attribute) {
        const item = this.actor.items.get(itemId);
        this._onRollSkill(item.name, item.data.data.value, this.actor.data.data.attributes[attribute].value, item.data.data.focus);
    }
    _onRollSkill(skillName, rank, attribute, focus) {
        let complication = 20 - this.actor.getComplicationFromInjuries();
        game.ac2d20.Dialog2d20.createDialog({ rollName: skillName, diceNum: 2, attribute: -1, skill: rank, focus: focus, complication: complication, actor: this.actor.data.data })
    }

    _onItemSummary(event) {
        event.preventDefault();
        let li = $(event.currentTarget).parents(".item");
        let item = this.actor.items.get(li.data("itemId"));
        // Toggle summary
        if (li.hasClass("expanded")) {
            let summary = li.children(".item-summary");
            summary.slideUp(200, () => {
                summary.remove();
            });
        } else {
            let div;
            if (item.data.type == 'weapon') {
                let effects = [];
                for (let [k, v] of Object.entries(item.data.data.effect)) {
                    if (v.value) effects.push(v.label)
                }
                let qualities = [];
                for (let [k, v] of Object.entries(item.data.data.qualities)) {
                    if (v.value) qualities.push(v.label)
                }
                div = $(
                    `<div class="item-summary">
                    <div class="item-summary-wrapper">
                    <div><strong>Effects:</strong> ${effects.join(', ')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Qualities:</strong> ${qualities.join(', ')}</div>
                    <div>${TextEditor.enrichHTML(item.data.data.description)}</div>
                    </div>
                    </div>`
                );
            } else {
                div = $(
                    `<div class="item-summary"><div class="item-summary-wrapper"><div class='editor-content'>${TextEditor.enrichHTML(item.data.data.description)}</div></div></div>`
                );
            }
            li.append(div.hide());
            div.slideDown(200);
        }
        li.toggleClass("expanded");
    }


    // Toggle Stashed Item
    _toggleStashed(id, item) {
        return {
            _id: id,
            data: {
                stashed: !item.data.data.stashed,
            },
        };
    }

    // Toggle Equipment
    _toggleEquipped(id, item) {
        console.log('IS EQIP', item.data.data.equipped)
        return {
            _id: id,
            data: {
                equipped: !item.data.data.equipped,
            },
        };
    }

    // Toggle Favorite
    _toggleFavorite(id, item) {
        return {
            _id: id,
            data: {
                favorite: !item.data.data.favorite,
            },
        };
    }

}
