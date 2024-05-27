export default class Roller2D20 {
	diceRolled = [];

	complicationThreshold = 20;

	critThreshold = 0;

	successes = 0;

	successThreshold = 0;

	static getRollModeSettings() {
		const rollMode = game.settings.get("core", "rollMode");

		let blind = false;
		let whisper = null;

		switch (rollMode) {
			case "blindroll": {
				blind = true;
			}
			case "gmroll": {
				const gmList = game.users.filter(user => user.isGM);
				const gmIDList = [];
				gmList.forEach(gm => gmIDList.push(gm.id));
				whisper = gmIDList;
				break;
			}
			case "roll": {
				const userList = game.users.filter(user => user.active);
				const userIDList = [];
				userList.forEach(user => userIDList.push(user.id));
				whisper = userIDList;
				break;
			}
			case "selfroll": {
				whisper = [game.user.id];
				break;
			}
			default: {
				break;
			}
		}
		return { whisper, blind };
	}


	static async rollD20({
		actorId = null,
		attribute = 0,
		complication = 20,
		dicenum = 2,
		difficulty = 1,
		focus = false,
		itemId = null,
		rollName = "Roll xD20",
		skill = 0,
	} = {}) {
		const successThreshold = parseInt(attribute) + parseInt(skill);
		const critThreshold = focus ? parseInt(skill) : 1;
		const complicationThreshold = parseInt(complication);

		const formula = `${dicenum}d20`;
		const roll = new Roll(formula);

		await roll.evaluate();

		await Roller2D20.parseD20Roll({
			actorId,
			complicationThreshold,
			critThreshold,
			itemId,
			roll,
			rollName,
			successThreshold,
		});
	}


	static async parseD20Roll({
		actorId = null,
		complicationThreshold = 20,
		critThreshold = 1,
		diceRolled = [],
		itemId = null,
		rerollIndexes = [],
		roll = null,
		rollName = "Roll xD20",
		successThreshold = 0,
	}) {
		let rerollIndex = 0;

		roll.dice.forEach(dice => {
			dice.results.forEach(roll => {
				let success = 0;
				let complication = 0;

				if (roll.result <= successThreshold) success++;
				if (roll.result <= critThreshold) success++;
				if (roll.result >= complicationThreshold) complication = 1;

				// If there are no rollIndexes sent then it is a new roll.
				// Otherwise it's a re-roll and we should replace dice at given
				// indexes
				if (!rerollIndexes.length) {
					diceRolled.push({
						complication,
						reroll: false,
						result: roll.result,
						success,
					});
				}
				else {
					diceRolled[rerollIndexes[rerollIndex]] = {
						complication,
						reroll: true,
						result: roll.result,
						success,
					};

					rerollIndex++;
				}
			});
		});

		await Roller2D20.sendToChat({
			actorId,
			complicationThreshold,
			critThreshold,
			diceRolled,
			itemId,
			rerollIndexes,
			roll,
			rollName,
			successThreshold,
		});
	}


	static async rerollD20({
		complicationThreshold = 20,
		critThreshold = 1,
		diceRolled = [],
		rerollIndexes = [],
		roll = null,
		rollName = "Roll xD20",
		successThreshold = 0,
	} = {}) {
		if (!rerollIndexes.length) {
			return ui.notifications.notify("Select the dice you wish to reroll");
		}

		let numOfDice = rerollIndexes.length;
		let formula = `${numOfDice}d20`;

		let _roll = new Roll(formula);
		await _roll.evaluate();

		await Roller2D20.parseD20Roll({
			rollName: `${rollName} [re-roll]`,
			roll: _roll,
			successThreshold: successThreshold,
			critThreshold: critThreshold,
			complicationThreshold: complicationThreshold,
			diceRolled: diceRolled,
			rerollIndexes: rerollIndexes,
		});
	}


	static async sendToChat({
		actorId = null,
		complicationThreshold = 20,
		critThreshold = 1,
		diceRolled = [],
		itemId = null,
		rerollIndexes = [],
		roll = null,
		rollName = "Roll xD20",
		successThreshold = 0,
	} = {}) {
		const successes = Roller2D20.getSuccessCount(diceRolled);
		const complications = Roller2D20.getComplicationCount(diceRolled);

		const rollData = {
			actorId,
			complications,
			itemId,
			results: diceRolled,
			rollName,
			successes,
			successThreshold: successThreshold,
		};

		const html = await renderTemplate(
			"systems/ac2d20/templates/chat/roll2d20.hbs",
			rollData
		);

		const ac2d20Roll = {
			complicationThreshold,
			critThreshold,
			diceFace: "d20",
			diceRolled,
			rerollIndexes,
			rollName,
			successThreshold,
		};

		const speaker = {actor: actorId};

		const { whisper, blind } = this.getRollModeSettings();

		let chatData = {
			blind,
			content: html,
			flags: { ac2d20roll: ac2d20Roll },
			roll,
			rollMode: game.settings.get("core", "rollMode"),
			speaker,
			user: game.user.id,
			whisper,
		};

		await ChatMessage.create(chatData);
	}


	static getSuccessCount(results) {
		let successes = 0;

		results.forEach(roll => {
			successes += roll.success;
		});

		return successes;
	}


	static getComplicationCount(results) {
		let complications = 0;

		results.forEach(roll => {
			complications += roll.complication;
		});

		return complications;
	}


	static async rollD6({ rollName = "Roll D6", dicenum = 2, itemId = null, actorId = null } = {}) {
		let formula = `${dicenum}ds`;
		let roll = new Roll(formula);
		await roll.evaluate();
		await Roller2D20.parseD6Roll({
			rollName: rollName,
			roll: roll,
			itemId: itemId,
			actorId: actorId,
		});
	}

	static async parseD6Roll({ rollName = "Roll D6", roll = null, diceRolled = [], rerollIndexes = [], addDice = [], itemId = null, actorId = null } = {}) {
		let diceResults = [
			{ result: 1, effect: 0 },
			{ result: 2, effect: 0 },
			{ result: 0, effect: 0 },
			{ result: 0, effect: 0 },
			{ result: 1, effect: 1 },
			{ result: 1, effect: 1 },
		];

		let i = 0;
		roll.dice.forEach(d => {
			d.results.forEach(r => {
				let diceResult = diceResults[r.result - 1];
				diceResult.face = r.result;
				// if there are no rollIndexes sent then it is a new roll.
				// Otherwise it's a re-roll and we should replace dices at given
				// indexes
				if (!rerollIndexes.length) {
					diceRolled.push(diceResult);
				}
				else {
					diceRolled[rerollIndexes[i]] = diceResult;
					i++;
				}
			});
		});

		if (addDice.length) {
			diceRolled = addDice.concat(diceRolled);
		}

		await Roller2D20.sendD6ToChat({
			rollName: rollName,
			roll: roll,
			diceRolled: diceRolled,
			rerollIndexes: rerollIndexes,
			itemId: itemId,
			actorId: actorId,
		});
	}

	static async rerollD6({ rollName = "Roll D6", roll = null, diceRolled = [], rerollIndexes = [], itemId = null, actorId = null } = {}) {
		if (!rerollIndexes.length) {
			ui.notifications.notify("Select Dice you want to Reroll");
			return;
		}
		let numOfDice = rerollIndexes.length;
		let formula = `${numOfDice}ds`;
		let _roll = new Roll(formula);
		await _roll.evaluate();
		await Roller2D20.parseD6Roll({
			rollName: `${rollName} [re-roll]`,
			roll: _roll,
			diceRolled: diceRolled,
			rerollIndexes: rerollIndexes,
			itemId: itemId,
			actorId: actorId,
		});
	}

	static async addD6({ rollName = "Roll D6", dicenum = 2, ac2d20Roll = null, diceRolled = [], itemId = null, actorId = null } = {}) {
		let formula = `${dicenum}ds`;
		let _roll = new Roll(formula);
		await _roll.evaluate();
		let newRollName = `${ac2d20Roll.rollName} [+ ${dicenum} DC]`;
		let oldDiceRolled = ac2d20Roll.diceRolled;
		await Roller2D20.parseD6Roll({
			rollName: newRollName,
			roll: _roll,
			diceRolled: diceRolled,
			addDice: oldDiceRolled,
			itemId: itemId,
			actorId: actorId,
		});
	}

	static async sendD6ToChat({ rollName = "Roll D6", roll = null, diceRolled = [], rerollIndexes = [], itemId = null, actorId = null } = {}) {
		let damage = diceRolled.reduce((a, b) => ({ result: a.result + b.result })).result;
		let effects = diceRolled.reduce((a, b) => ({ effect: a.effect + b.effect })).effect;
		// let weaponDamageTypesList = [];
		// let weaponDamageEffectsList = [];
		// let weaponQualityList = [];

		let itemEffects = [];
		let itemQualities = [];

		if (itemId && actorId) {
			let actor = game.actors.get(actorId);
			let item = null;
			if (actor) {
				item = actor.items.get(itemId);
			}
			if (item) {
				if (item.type === "spell") {
					itemEffects = item.system.costEffects;
				}
				else if (item.type === "weapon") {
					for (let de in item.system.effect) {
						if (item.system.effect[de].value) {
							let rank = item.system.effect[de].rank ?? "";
							let damageEffectLabel = game.i18n.localize(`AC2D20.WEAPONS.damageEffect.${de}`);
							let efectLabel = `<span data-tooltip="${Handlebars.helpers.getTooltipFromConfigKey(`AC2D20.WEAPONS.effects.${de}`)}">${damageEffectLabel}${rank}</span>`;
							itemEffects.push(efectLabel);
						}
					}
					itemEffects = itemEffects.join(", ");

					for (let qu in item.system.qualities) {
						if (item.system.qualities[qu].value) {
							let quLabel = game.i18n.localize(`AC2D20.WEAPONS.qualities.${qu}`);
							itemQualities.push(quLabel);
						}
					}
				}
			}

		}

		let rollData = {
			rollName: rollName,
			damage: damage,
			effects: effects,
			results: diceRolled,
			itemEffects: itemEffects,
			itemQualities: itemQualities,
		};
		const html = await renderTemplate("systems/ac2d20/templates/chat/rollD6.hbs", rollData);
		let ac2d20Roll = {};
		ac2d20Roll.rollName = rollName;
		ac2d20Roll.diceRolled = diceRolled;
		ac2d20Roll.damage = damage;
		ac2d20Roll.effects = effects;
		ac2d20Roll.rerollIndexes = rerollIndexes;
		ac2d20Roll.diceFace = "d6";

		let chatData = {
			user: game.user.id,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
			flags: { ac2d20roll: ac2d20Roll, itemId: itemId, actorId: actorId },
			type: CONST.CHAT_MESSAGE_TYPES.ROLL,
			roll: roll,
		};
		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		}
		else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}
		await ChatMessage.create(chatData);

	}
}

