// import { AC2D20 } from "../helpers/config.mjs";
import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export default class ACActorSheet
	extends foundry.appv1.sheets.ActorSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["ac2d20", "sheet", "actor"],
			template: "systems/ac2d20/templates/actor/actor-sheet.hbs",
			width: 720,
			height: 880,
			dragDrop: [{dragSelector: ".item", dropSelector: null}],
			tabs: [{
				contentSelector: ".sheet-body",
				initial: "abilities",
				navSelector: ".sheet-tabs",
			}],
		});
	}

	/** @override */
	get template() {
		return `systems/ac2d20/templates/actor/actor-${this.actor.type}-sheet.hbs`;
	}

	/** @inheritdoc */
	get title() {
		const type = game.i18n.localize(`TYPES.Actor.${this.actor.type}`);
		return `[${type}] ${this.actor.name}`;
	}

	/* -------------------------------------------- */

	/** @override */
	async getData() {

		// const context = super.getData();

		// const actorData = context.actor.data;

		const source = this.actor.toObject();
		const actorData = this.actor.toObject(false);

		// Sort all items alphabetically for display on the character sheet
		actorData.items.sort((a, b) => a.name.localeCompare(b.name));

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

		const textEditor = foundry.applications.ux.TextEditor.implementation;

		context.biographyHTML = await textEditor.enrichHTML(context.system.biography, {
			secrets: this.actor.isOwner,
			rollData: context.rollData,
			async: true,
		});

		this._prepareItems(context);

		// Prepare character data and items.
		if (actorData.type === "character") {
			this._prepareCharacterData(context);
		}

		// Prepare Creature data and items.
		if (actorData.type === "vehicle") {
			context.vehicleQualities = this._getVehicleQualities();
		}

		// Prepare Items Enriched Descriptions
		const itemTypes = ["talent"];
		let itemsEnrichedDescriptions = {};
		for await (let item of this.actor.items) {
			if (itemTypes.includes(item.type)) {
				const descriptionRich =
					await textEditor.enrichHTML(item.system.description, {async: true});

				itemsEnrichedDescriptions[item._id] = descriptionRich;
			}
		}

		context.itemsEnrichedDescriptions = itemsEnrichedDescriptions;

		// Prepare active effects
		context.effects = prepareActiveEffectCategories(this.actor.effects);
		context.AC2D20 = CONFIG.AC2D20;

		return context;
	}

	_getVehicleQualities() {
		const vehicleQualities = [];
		for (const key in CONFIG.AC2D20.VEHICLE_QUALITIES) {
			vehicleQualities.push({
				active: this.actor.system?.qualities[key].value ?? false,
				hasRank: CONFIG.AC2D20.VEHICLE_QUALITY_HAS_RANK[key],
				rank: this.actor.system?.qualities[key].rank,
				key,
				label: CONFIG.AC2D20.VEHICLE_QUALITIES[key],
			});
		}

		return vehicleQualities.sort(
			(a, b) => a.label.localeCompare(b.label)
		);
	}

	async _onDropItem(event, data) {
		if ( !this.actor.isOwner ) return false;

		const droppedItem = data?.uuid ? await fromUuid(data.uuid) : null;
		const type = droppedItem.type;

		// Don't do anything if this actor cannot own the dropped item
		//
		switch (this.actor.type) {
			case "character": {
				if (type === "special_rule") return;
				break;
			}
			case "npc": {
				if ([
					"armor",
					"equipment",
					"skillkit",
					"talent",
				].includes(type)) return;
				break;
			}
			case "vehicle": {
				if ([
					"armor",
					"equipment",
					"skill",
					"skillkit",
					"special_rule",
					"spell",
					"talent",
				].includes(type)) return;
				break;
			}
		}

		const item = await Item.implementation.fromDropData(data);
		const itemData = item.toObject();

		if (item.parent !== null) {
			if (item.parent.isOwner) item.delete();
		}

		return this._onDropItemCreate(itemData);
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
				i.localizedName = ac2d20.utils.getLocalizedSkillName(i.name);
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

		context.skills = skills.sort((a, b) => a.localizedName.localeCompare(b.localizedName));

		context.armor = armor;
		context.equipment = equipment;
		context.skillkits = skillkits;
		context.specialRules = specialRules;
		context.spells = spells;
		context.talents = talents;
		context.weapons = weapons;
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

			const complication = 20 - this.actor.system.injuries.value;

			const attrName = game.i18n.localize(`AC2D20.Ability.${attr}`);
			game.ac2d20.Dialog2d20.createDialog({ rollName: `Roll ${attrName}`, diceNum: 2, attribute: attribute.value, skill: 0, focus: false, complication: complication });
		});

		// * SKILLS LISTENERS [clic, right-click, value change, focus ]
		// Click Skill Item
		html.find(".roll-skill.clickable").click(ev => {
			const itemId = ev.currentTarget.dataset.itemId;
			const item = this.actor.items.get(itemId);

			this._onRollSkill({skillItem: item});
		});

		html.find(".roll-focus.clickable").click(async event => {
			const dataset = event.currentTarget.dataset;

			const itemId = dataset.itemId;
			const focusName = dataset.focusName;

			const skillItem = this.actor.items.get(itemId);

			if (event.ctrlKey) {
				const focuses = foundry.utils.duplicate(skillItem.system.focuses);

				for (const focus of focuses) {
					if (focus.title === focusName) {
						focus.isfocus = !focus.isfocus;
						break;
					}
				}

				await skillItem.update({"system.focuses": focuses});
			}
			else {
				this._onRollSkill({
					skillItem,
					focusName,
				});
			}
		});

		// Change Skill Rank value
		html.find(".skill-value-input").change(async ev => {
			let newRank = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, system: { value: newRank } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		// Toggle Focus value
		// html.find(".skill .item-skill-focus").click(async ev => {
		// 	const li = $(ev.currentTarget).parents(".item");
		// 	const item = this.actor.items.get(li.data("itemId"));
		// 	let updatedItem = { _id: item.id, system: { focus: !item.system.focus } };
		// 	await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		// });
		// * END SKILLS


		// * SPELLS GRID
		html.find(".cell-expander").click(event => {
			this._onItemSummary(event);
		});


		html.find(".roll-spell.clickable").click(event => {
			event.preventDefault();
			const li = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));

			let complication = 20 - parseInt(item.system.difficulty - 1);
			complication -= this.actor.system.injuries.value;

			const skillName = item.system.skill;
			const focusName = item.system.focus;
			if (!skillName) return;

			const skill = this.actor.items.getName(skillName);
			const skillRank = skill?.system?.value ?? 0;

			let isFocus = false;
			for (const [, value] of Object.entries(skill?.system?.focuses ?? {})) {
				if (value.title === focusName && value.isfocus) isFocus = true;
			}

			let prefAttribute = "ins";
			if (this.actor.system.spellcastingType === "researcher") {
				prefAttribute = "rea";
			}
			else if (this.actor.system.spellcastingType === "dabbler") {
				prefAttribute = "wil";
			}

			ac2d20.Dialog2d20.createDialog({
				rollName: item.name,
				diceNum: 2,
				attribute: -1,
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

			game.ac2d20.DialogD6.createDialog({
				ac2d20Roll: null,
				actorId: this.actor._id,
				diceNum: cost,
				itemId: itemId,
				rollName: `${item.name} - Cost`,
			});
		});

		html.find(".item-value-changer").change(async event => {
			event.preventDefault();
			const keyToChange = $(event.currentTarget).data("field");
			const newValue = $(event.currentTarget).val();
			const li = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let data = {};
			data[keyToChange] = newValue;
			let updatedItem = { _id: item.id, system: data };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		// * WEAPON
		html.find(".roll-weapon.clickable").click(event => {
			event.preventDefault();
			const li = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));

			let complication = 20 - this.actor.system.injuries.value;

			// if unrelliable increase complication
			for (const [k, v] of Object.entries(item.system.qualities)) {
				if (v.value && k === "unreliable") complication -= 1;
			}

			const focusName = item.system.focus;

			const skillItem = this.actor.items.getName(item.system.skill);

			const skill = skillItem && skillItem.system?.value
				? skillItem.system.value
				: 0;

			const skillFocuses = skillItem?.system?.focuses ?? [];

			const focus = skillFocuses.find(
				focus => focus.title === focusName
			)?.isfocus ?? false;

			const attribute = item.actor.type === "vehicle" ? 6 : -1;

			// weaponType is actualy attribute abrevation
			const prefAttribute = item.system.weaponType;

			game.ac2d20.Dialog2d20.createDialog({
				actor: this.actor.system,
				actorId: this.actor._id,
				attribute,
				complication,
				diceNum: 2,
				focus,
				itemId: item._id,
				prefAttribute,
				rollName: item.name,
				skill,
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
			let updatedItem = { _id: item.id, system: { ammo: newQuantity } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		// * RESOURCE COUNT
		html.find(".resources-quantity").change(async ev => {
			let newQuantity = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, system: { resources: newQuantity } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		//* Quantity Change
		html.find(".quantity-count").change(async ev => {
			let newQuantity = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, system: { quantity: newQuantity } };
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


		// TRUTHS
		html.find(".truth-create").click(this._onTruthCreate.bind(this));

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
			await item.update({"system.equipped": !item.system.equipped});
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
		const contextMenu = foundry.applications.ux.ContextMenu.implementation;

		const truthsMenu = [
			{
				icon: '<i class="fas fa-edit"></i>',
				name: "",
				callback: t => {
					this._onTruthEdit(t.dataset);
				},
			},
			{
				icon: '<i class="fas fa-trash"></i>',
				name: "",
				callback: t => {
					this._onTruthDelete(t.dataset);
				},
			},
		];

		new contextMenu(html.get(0), ".truth-edit", truthsMenu, {jQuery: false});


		const editableItemsMenu = [
			{
				icon: '<i class="fas fa-comment"></i>',
				name: "",
				callback: t => {
					this._onPostItem(t.dataset.itemId);
				},
			},
			{
				icon: '<i class="fas fa-edit"></i>',
				name: "",
				callback: t => {
					this._editOwnedItemById(t.dataset.itemId);
				},
			},
			{
				icon: '<i class="fas fa-trash"></i>',
				name: "",
				callback: t => {
					this._deleteOwnedItemById(t.dataset.itemId);
				},
			},
		];

		new contextMenu(html.get(0), ".editable-item", editableItemsMenu, {jQuery: false});


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
		const data = foundry.utils.duplicate(header.dataset);
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
		const newItem = await Item.create(itemData, { parent: this.actor });
		newItem.sheet.render(true);
	}

	async _onRightClickDelete(itemId) {
		const item = this.actor.items.get(itemId);
		await item.delete();
		// li.slideUp(200, () => this.render(false));
	}


	_onRollSkill({focusName = "", skillItem = null}) {
		let localizedFocusName = focusName;
		let focus = false;

		if (focusName !== "") {
			localizedFocusName = ac2d20.utils.getLocalizedFocusName(focusName);

			for (const skillFocus of skillItem.system.focuses) {
				if (skillFocus.title === focusName) {
					focus = skillFocus.isfocus;
					break;
				}
			}
		}

		const complication = 20 - this.actor.system.injuries.value;

		const localizedSkillName =
			ac2d20.utils.getLocalizedSkillName(skillItem.name);

		const rollName = focusName !== ""
			? `${localizedFocusName} (${localizedSkillName})`
			: localizedSkillName;

		ac2d20.Dialog2d20.createDialog({
			actor: this.actor.system,
			attribute: -1,
			complication,
			diceNum: 2,
			focus,
			prefAttribute: skillItem.system.defaultAttribute,
			rollName,
			skill: skillItem.system.value,
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
			const textEditor = foundry.applications.ux.TextEditor.implementation;

			let _descriptionText = await textEditor.enrichHTML(
				item.system.description, {async: true}
			);

			let div = $(`<div class="item-summary"><div class="item-summary-wrapper"><div class='editor-content'>${_descriptionText}</div></div></div>`);

			li.append(div.hide());
			div.slideDown(200);
		}
		li.toggleClass("expanded");
	}


	async _onTruthCreate(event) {
		event.preventDefault();
		const actorUuid = this.actor.uuid;

		ac2d20.dialogs.DialogEditTruth.createDialog({actorUuid});
	}

	async _onTruthDelete(data) {
		const currentTruths = foundry.utils.duplicate(this.actor.system.truths);
		currentTruths.splice(data.truthIndex, 1);

		this.actor.update({"system.truths": currentTruths});
	}

	async _onTruthEdit(data) {
		const actorUuid = this.actor.uuid;

		const currentTruths = foundry.utils.duplicate(this.actor.system.truths);

		const index = data.truthIndex;
		const truth = currentTruths[index];

		ac2d20.dialogs.DialogEditTruth.createDialog({actorUuid, index, truth});
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
