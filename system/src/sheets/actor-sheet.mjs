// import { AC2D20 } from "../helpers/config.mjs";
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
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "abilities" }],
		});
	}

	/** @override */
	get template() {
		return `systems/ac2d20/templates/actor/actor-${this.actor.type}-sheet.html`;
	}

	/* -------------------------------------------- */

	/** @override */
	async getData() {

		// const context = super.getData();

		// const actorData = context.actor.data;

		const source = this.actor.toObject();
		const actorData = this.actor.toObject(false);

		// Sort all items alphabetically for display on the character sheet
		actorData.items.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});

		const context = {
			actor: actorData,
			source: source.system,
			system: actorData.system,
			items: actorData.items,
			effects: prepareActiveEffectCategories(this.actor.effects),
			owner: this.actor.isOwner,
			limited: this.actor.limited,
			options: this.options,
			editable: this.isEditable,
			type: this.actor.type,
			isCharacter: this.actor.type === "character",
			isNPC: this.actor.type === "npc",
			isVehicle: this.actor.type === "vehicle",
			rollData: this.actor.getRollData.bind(this.actor),
		};

		// Add the actor's data to context.data for easier access, as well as flags.
		// context.data = actorData.data;
		// context.flags = actorData.flags;

		context.biographyHTML = await TextEditor.enrichHTML(context.system.biography, {
			secrets: this.actor.isOwner,
			rollData: context.rollData,
			async: true,
		});

		// Prepare character data and items.
		if (actorData.type === "character") {
			this._prepareItems(context);
			this._prepareCharacterData(context);
		}

		// Prepare NPC data and items.
		if (actorData.type === "npc") {
			this._prepareItems(context);
		}

		// Prepare Creature data and items.
		if (actorData.type === "vehicle") {
			this._prepareItems(context);

		}

		// Add roll data for TinyMCE editors.
		// context.rollData = context.actor.getRollData();

		// Prepare Items Enriched Descriptions
		const itemTypes = ["talent"];
		let itemsEnrichedDescriptions = {};
		for await (let itm of this.actor.items) {
			if (itemTypes.includes(itm.type)) {
				const descriptionRich =
					await TextEditor.enrichHTML(itm.system.description, {async: true});

				itemsEnrichedDescriptions[itm._id] = descriptionRich;
			}
		}

		context.itemsEnrichedDescriptions = itemsEnrichedDescriptions;

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
	async _prepareCharacterData(context) {
		let isEncumbered = false;
		let physicalItems = context.items.filter(i => i.system.hasOwnProperty("weight"));
		let encumberingItems = physicalItems.filter(i => {
			if (i.type !== "armor") {
				return true;
			}
			else if (!i.system.equipped || (i.system.equipped && i.system.qualities.heavy.value)) {
				return true;
			}
			else {
				return false;
			}
		});
		context.minorItemsTotal = encumberingItems.filter(
			i => parseInt(i.system.weight) === 1
		).length;

		context.majorItemsTotal = encumberingItems.filter(
			i => parseInt(i.system.weight) === 3
		).length;

		let totalEncumbrance = 0;
		for (let i = 0; i < encumberingItems.length; i++) {
			totalEncumbrance += parseInt(encumberingItems[i].system.quantity)
				* parseInt(encumberingItems[i].system.weight);
		}

		if (totalEncumbrance > this.actor.system.carryCapacity.value) isEncumbered = true;

		context.totalEncumbrance = totalEncumbrance;
		context.isEncumbered = isEncumbered;
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
		const specialRules = [];

		// Iterate through items, allocating to containers
		for (let i of context.items) {
			i.img = i.img || DEFAULT_TOKEN;
			// Append to gear.
			if (i.type === "skill") {
				skills.push(i);
			}
			else if (i.type === "talent") {
				talents.push(i);
			}
			else if (i.type === "spell") {
				spells.push(i);
			}
			else if (i.type === "armor") {
				armor.push(i);
			}
			else if (i.type === "weapon") {
				weapons.push(i);
			}
			else if (i.type === "skillkit") {
				skillkits.push(i);
			}
			else if (i.type === "equipment") {
				equipment.push(i);
			}
			else if (i.type === "special_rule") {
				specialRules.push(i);
			}
		}

		// Assign and return
		skills.sort(function(a, b) {
			let nameA = a.name.toUpperCase();
			let nameB = b.name.toUpperCase();
			return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
		});
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
		html.find(".tab-switch").click(evt => {
			evt.preventDefault();
			const el = evt.currentTarget;
			const tab = el.dataset.tab;
			this._tabs[0].activate(tab);
		});

		// Render the item sheet for viewing/editing prior to the editable check.
		html.find(".item-edit").click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});


		// -------------------------------------------------------------
		// ! Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// ATTRIBUTE ROLL
		html.find(".roll-attribute.clickable").click(event => {
			event.preventDefault();
			let attr = $(event.currentTarget).data("attr");
			let attribute = this.actor.system.attributes[attr];
			let complication = 20;
			if (this.actor.type === "character") complication -= this.actor.getComplicationFromInjuries();

			if (this.actor.type === "npc" || this.actor.type === "vehicle") complication -= this.actor.system.injuries.value;

			const attrName = game.i18n.localize(`AC2D20.Ability.${attr}`);
			game.ac2d20.Dialog2d20.createDialog({ rollName: `Roll ${attrName}`, diceNum: 2, attribute: attribute.value, skill: 0, focus: false, complication: complication });
		});

		// * SKILLS LISTENERS [clic, right-click, value change, focus ]
		// Click Skill Item
		html.find(".roll-skill.clickable, .roll-focus.clickable").click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let isFocused = $(ev.currentTarget).hasClass("focused");

			this._onRollSkill(
				item.name,
				item.system.value,
				this.actor.system.attributes[item.system.defaultAttribute].value,
				isFocused
			);
		});
		// Change Skill Rank value
		html.find(".skill-value-input").change(async ev => {
			let newRank = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, data: { value: newRank } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});
		// Toggle Focus value
		html.find(".skill .item-skill-focus").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, data: { focus: !item.system.focus } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});
		// * END SKILLS

		// * TRUTHS
		html.find(".truth-text").change(async ev => {
			let updates = [];
			$(".truth-cell").each((i, el) => {
				let _txt = this._clearTextAreaText($(el).find(".truth-text").val());
				let truth = {
					text: _txt,
				};
				updates.push(truth);
			});
			await this.actor.update({ "system.truths": updates });
		});
		// * END TRUTHS

		// * SPELLS GRID
		html.find(".cell-expander").click(event => {
			this._onItemSummary(event);
		});

		html.find(".roll-spell.clickable").click(event => {
			event.preventDefault();
			const li = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let complication = 20 - parseInt(item.system.difficulty - 1);
			if (item.actor.type === "character") complication -= item.actor.getComplicationFromInjuries();

			if (item.actor.type === "npc") complication -= item.actor.system.injuries.value;

			const skillName = item.system.skill;
			const focusName = item.system.focus;
			if (!skillName) return;

			const skill = this.actor.items.getName(skillName);
			let skillRank = 0;
			try {
				skillRank = skill.system.value;
			}
			catch(err) { }
			let isFocus = false;
			try {
				for (const [, value] of Object.entries(skill.system.focuses)) {
					if (value.title === focusName && value.isfocus) isFocus = true;
				}
			}
			catch(err) { }

			const attrValue = -1;
			let prefAttribute = "ins";
			if (this.actor.system.spellcastingType === "researcher") {
				prefAttribute = "rea";
			}
			else if (this.actor.system.spellcastingType === "dabbler") {
				prefAttribute = "wil";
			}

			game.ac2d20.Dialog2d20.createDialog({
				rollName: item.name,
				diceNum: 2,
				attribute: attrValue,
				skill: skillRank,
				focus: isFocus,
				complication: complication,
				actor: this.actor.system,
				prefAttribute: prefAttribute,
			});

		});

		html.find(".roll-spell-cost.clickable").click(event => {
			event.preventDefault();
			const li = $(event.currentTarget).parents(".item");
			const itemId = li.data("itemId");
			const item = this.actor.items.get(li.data("itemId"));
			const cost = parseInt(item.system.cost);
			game.ac2d20.DialogD6.createDialog({ rollName: `${item.name} - Cost`, diceNum: cost, ac2d20Roll: null, itemId: itemId, actorId: this.actor._id });
		});

		html.find(".item-value-changer").change(async event => {
			event.preventDefault();
			const keyToChange = $(event.currentTarget).data("field");
			const newValue = $(event.currentTarget).val();
			const li = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let data = {};
			data[keyToChange] = newValue;
			let updatedItem = { _id: item.id, data: data };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		// * WEAPON
		html.find(".roll-weapon.clickable").click(event => {
			event.preventDefault();
			const li = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let complication = 20;
			// if unrelliable increase complication
			for (const [k, v] of Object.entries(item.system.qualities)) {
				if (v.value && k === "unreliable") complication -= 1;
			}

			if (item.actor.type === "character") {
				complication -= item.actor.getComplicationFromInjuries();
			}

			if (item.actor.type === "npc" || item.actor.type === "vehicle") {
				complication -= item.actor.system.injuries.value;
			}

			const focusName = item.system.focus;
			// if (!focusName)
			// return;

			const skill = this.actor.items.getName(item.system.skill);
			let skillRank = 0;
			try {
				skillRank = skill.system.value;
			}
			catch(err) {
				console.log(err);
			}
			let isFocus = false;
			try {
				for (const [, value] of Object.entries(skill.system.focuses)) {
					if (value.title === focusName && value.isfocus) isFocus = true;
				}
			}
			catch(err) {
				console.log(err);
			}

			const attrValue = item.actor.type === "vehicle" ? 6 : -1;
			// weaponType is actualy attribute abrevation
			const prefAttribute = item.system.weaponType;
			game.ac2d20.Dialog2d20.createDialog({
				rollName: item.name,
				diceNum: 2,
				attribute: attrValue,
				skill: skillRank,
				focus: isFocus,
				complication: complication,
				actor: this.actor.system,
				prefAttribute: prefAttribute,
				actorId: this.actor._id,
				itemId: item._id,
			});

		});

		html.find(".roll-stress.clickable").click(event => {
			event.preventDefault();
			const li = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			const itemId = li.data("itemId");
			let stressBonus = 0;
			if (item.system.weaponType === "agi") stressBonus = item.actor.system.attributes.bra.bonus;
			else if (item.system.weaponType === "coo") stressBonus = item.actor.system.attributes.ins.bonus;
			else if (item.system.weaponType === "wil") stressBonus = item.actor.system.attributes.wil.bonus;
			let stress = parseInt(item.system.stress) + parseInt(stressBonus);
			game.ac2d20.DialogD6.createDialog({
				rollName: item.name,
				diceNum: stress,
				ac2d20Roll: null,
				itemId: itemId,
				actorId: this.actor._id,
			});
		});

		// * AMMO COUNT UPDATE
		html.find(".ammo-quantity").change(async ev => {
			let newQuantity = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, data: { ammo: newQuantity } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		// * RESOURCE COUNT
		html.find(".resources-quantity").change(async ev => {
			let newQuantity = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, data: { resources: newQuantity } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		//* Quantity Change
		html.find(".quantity-count").change(async ev => {
			let newQuantity = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, data: { quantity: newQuantity } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		html.find(".roll-impact.clickable").click(event => {
			event.preventDefault();
			const impact = this.actor.system.impact;
			game.ac2d20.DialogD6.createDialog({ rollName: `${this.actor.name} Impact`, diceNum: impact, ac2d20Roll: null });
		});

		// * CLICK TO EXPAND
		html.find(".expandable-info").click(event => this._onItemSummary(event));

		// * Add Inventory Item
		html.find(".item-create").click(this._onItemCreate.bind(this));

		// * Delete Inventory Item
		html.find(".item-delete").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			await item.delete();
			li.slideUp(200, () => this.render(false));
		});

		// * Toggle Stash Inventory Item
		html.find(".item-stash").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));
			await this.actor.updateEmbeddedDocuments("Item", [this._toggleStashed(li.data("item-id"), item)]);
		});

		// * Toggle Equip Inventory Item
		html.find(".item-toggle").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));
			await this.actor.updateEmbeddedDocuments("Item", [this._toggleEquipped(li.data("item-id"), item)]);
		});

		// * Toggle Favorite Inventory Item
		html.find(".item-favorite").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));
			await this.actor.updateEmbeddedDocuments("Item", [this._toggleFavorite(li.data("item-id"), item)]);
		});

		// * INJURIES
		html.find(".injury-text, .treated, .injury-type").change(async ev => {
			const $parent = $(ev.currentTarget).parents(".injury");
			const injuryNum = $parent.data("injury");
			let inj = {
				text: $parent.find(".injury-text").val(),
				treated: $parent.find(".controls .treated").is(":checked"),
				injuryType: $parent.find(".controls .injury-type").is(":checked"),
			};
			const dataPath = `system.injuries.${injuryNum}`;
			await this.actor.update({[`${dataPath}`]: inj });

		});
		// * END INJURIES

		// * Active Effect management
		html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

		/* -------------------------------------------- */
		/* ADD RIGHT CLICK CONTENT MENU
        /* -------------------------------------------- */
		let menu_items = [
			{
				icon: '<i class="fas fa-comment"></i>',
				name: "",

				callback: t => {
					this._onPostItem(t.data("item-id"));
				},
			},
			{
				icon: '<i class="fas fa-edit"></i>',
				name: "",
				callback: t => {
					this._editOwnedItemById(t.data("item-id"));
				},
			},
			{
				icon: '<i class="fas fa-trash"></i>',
				name: "",
				callback: t => {
					this._deleteOwnedItemById(t.data("item-id"));
				},
				condition: t => {
					if (t.data("coreskill")) {
						return t.data("coreskill").length < 1;
					}
					else {
						return true;
					}
				},
			},
		];

		new ContextMenu(html, ".editable-item", menu_items);


		// ! DON'T LET NUMBER FIELDS EMPTY
		const numInputs = document.querySelectorAll("input[type=number]");
		numInputs.forEach(function(input) {
			input.addEventListener("change", function(e) {
				if (e.target.value === "") {
					e.target.value = 0;
				}
			});
		});
	}


	_editOwnedItemById(_itemId) {
		const item = this.actor.items.get(_itemId);
		item.sheet.render(true);
	}

	async _deleteOwnedItemById(_itemId) {
		const item = this.actor.items.get(_itemId);
		await item.delete();
	}

	_onPostItem(_itemId) {
		const item = this.actor.items.get(_itemId);
		item.sendToChat();
	}

	// * UTILS
	_clearTextAreaText(txt) {
		txt.trim();
		txt = txt.replace(/  +/g, " ");
		// ! replace new lines with encided \n so stupid textarea doesn't break
		txt = txt.replace(/(?:\r\n|\r|\n)/g, "&#13;&#10;");
		return txt;
	}

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
			data: data,
		};
		// Remove the type from the dataset since it's in the itemData.type prop.
		delete itemData.data.type;
		// Finally, create the item!
		return await Item.create(itemData, { parent: this.actor });
	}

	async _onRightClickDelete(itemId) {
		const item = this.actor.items.get(itemId);
		await item.delete();
		// li.slideUp(200, () => this.render(false));
	}

	_onRightClickSkill(itemId, attribute) {
		const item = this.actor.items.get(itemId);
		this._onRollSkill(
			item.name,
			item.system.value,
			this.actor.system.attributes[attribute].value,
			item.system.focus
		);
	}

	_onRollSkill(skillName, rank, attribute, focus) {
		let complication = 20 - this.actor.getComplicationFromInjuries();
		game.ac2d20.Dialog2d20.createDialog({
			rollName: skillName,
			diceNum: 2,
			attribute: -1,
			skill: rank,
			focus: focus,
			complication: complication,
			actor: this.actor.system,
		});
	}

	async _onItemSummary(event) {
		event.preventDefault();
		let li = $(event.currentTarget).parents(".item");
		let item = this.actor.items.get(li.data("itemId"));
		// Toggle summary
		if (li.hasClass("expanded")) {
			let summary = li.children(".item-summary");
			summary.slideUp(200, () => {
				summary.remove();
			});
		}
		else {
			let _descriptionText = await TextEditor.enrichHTML(
				item.system.description, {async: true}
			);

			let div = $(`<div class="item-summary"><div class="item-summary-wrapper"><div class='editor-content'>${_descriptionText}</div></div></div>`);

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
				stashed: !item.system.stashed,
			},
		};
	}

	// Toggle Equipment
	_toggleEquipped(id, item) {
		return {
			_id: id,
			data: {
				equipped: !item.system.equipped,
			},
		};
	}

	// Toggle Favorite
	_toggleFavorite(id, item) {
		return {
			_id: id,
			data: {
				favorite: !item.system.favorite,
			},
		};
	}

}
