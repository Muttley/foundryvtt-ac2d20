import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export default class ACItemSheet
	extends foundry.appv1.sheets.ItemSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["ac2d20", "sheet", "item"],
			width: 520,
			height: 560,
			tabs: [{
				contentSelector: ".sheet-body",
				initial: "attributes",
				navSelector: ".sheet-tabs",
			}],
		});
	}


	/** @override */
	get template() {
		const path = "systems/ac2d20/templates/item";
		return `${path}/item-${this.item.type}-sheet.hbs`;
	}


	/** @inheritdoc */
	get title() {
		const type = game.i18n.localize(`TYPES.Item.${this.item.type}`);
		return `[${type}] ${this.item.name}`;
	}

	/* -------------------------------------------- */


	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Send to Chat
		html.find(".post-item").click(ev => {
			this.item.sendToChat();
		});

		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		html.find(".effect-control").click(ev => {
			if (this.item.isOwned) {
				return ui.notifications.warn(
					game.i18n.localize("AC2D20.Warnings.OnEditOwnedItemActiveEffects")
				);
			}

			onManageActiveEffect(ev, this.item);
		});

		// SKILL AND FOCUS
		html.find(".focus-add").click(async ev => {
			await this.item.addFocus();
		});

		html.find(".focus-delete").click(async ev => {
			await this.item.deleteFocus($(ev.currentTarget).data("index"));
		});

		html.find(".focus-title, .focus-cb").change(async ev => {
			let focuses = [];

			html.find(".focus-item").each(function(index) {
				focuses = [...focuses, {
					title: $(this).find(".focus-title").val(),
					isfocus: $(this).find(".focus-cb").is(":checked"),
				}];
			});

			focuses.sort((a, b) => a.title.localeCompare(b.title));

			await this.item.update({"system.focuses": focuses});
		});


		// DON't LET NUMBER FIELDS EMPTY
		const numInputs = document.querySelectorAll("input[type=number]");
		numInputs.forEach(function(input) {
			input.addEventListener("change", function(e) {
				if (e.target.value === "") {
					e.target.value = 0;
				}
			});
		});
	}


	/** @override */
	async getData() {
		const context = await super.getData();

		const item = context.item;
		const source = item.toObject();

		foundry.utils.mergeObject(context, {
			AC2D20: CONFIG.AC2D20,
			effects: prepareActiveEffectCategories(item.effects),
			flags: item.flags,
			isEmbedded: item.isEmbedded,
			source: source.system,
			system: item.system,
			type: item.type,
		});

		context.descriptionHTML = await TextEditor.enrichHTML(
			item.system.description,
			{
				secrets: item.isOwner,
				async: true,
			}
		);

		context.rollData = this.actor?.getRollData() ?? {};

		// Any item specific data used in templates
		//
		if (item.type === "skill") {
			context.system.focuses = context.system.focuses.sort(
				(a, b) => a.title.localeCompare(b.title)
			);
		}
		else if (item.type === "weapon") {
			context.damageEffects = this._getWeaponDamageEffects();
			context.weaponQualities = this._getWeaponQualities();
		}

		return context;
	}


	_getWeaponDamageEffects() {
		const damageEffects = [];
		for (const key in CONFIG.AC2D20.DAMAGE_EFFECTS) {
			damageEffects.push({
				active: this.item.system?.effect[key].value ?? false,
				hasRank: CONFIG.AC2D20.DAMAGE_EFFECT_HAS_RANK[key],
				rank: this.item.system?.effect[key].rank,
				key,
				label: CONFIG.AC2D20.DAMAGE_EFFECTS[key],
			});
		}

		return damageEffects.sort(
			(a, b) => a.label.localeCompare(b.label)
		);
	}


	_getWeaponQualities() {
		const weaponQualities = [];
		for (const key in CONFIG.AC2D20.WEAPON_QUALITIES) {
			weaponQualities.push({
				active: this.item.system?.qualities[key].value ?? false,
				key,
				label: CONFIG.AC2D20.WEAPON_QUALITIES[key],
			});
		}

		return weaponQualities.sort(
			(a, b) => a.label.localeCompare(b.label)
		);
	}


	/** @override */
	async _onSubmit(event) {
		if (!this.isEditable) return;

		if (["spell", "weapon"].includes(this.item.type)) {
			const updateData = this._getSubmitData();

			const newSkill = updateData["system.skill"];
			if (newSkill !== this.item.system.skill) {
				// Skill has changed so existing focus setting is not valid
				updateData["system.focus"] = "";
			}

			this.item.update(updateData);
		}
		else {
			return super._onSubmit(event);
		}
	}
}
