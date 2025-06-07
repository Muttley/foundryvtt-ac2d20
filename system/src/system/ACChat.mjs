export class ACChat {

	static async _renderChatMessage(
		actor,
		data,
		template,
		mode
	) {
		const html = await foundry.applications.handlebars.renderTemplate(template, data);

		if (!mode) {
			mode = game.settings.get("core", "rollMode");
		}

		const chatData = {
			user: game.user.id,
			speaker: ChatMessage.getSpeaker({
				actor: actor,
			}),
			rollMode: mode,
			content: html,
			type: CONST.CHAT_MESSAGE_TYPES.OTHER,
		};

		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		}
		else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}

		await ChatMessage.create(chatData);
	}

	static async onRenderChatMessage(message, html, data) {
		ac2d20.logger.debug("Running renderChatMessageHTML hook");

		html.querySelectorAll(".reroll-button").forEach(element => {
			element.addEventListener("click", async event => {
				const rerollIndex = [];

				const selectedDice = html.querySelectorAll(".dice-selected");
				for (const die of selectedDice) {
					rerollIndex.push(die.dataset.index);
				}

				const rollData = message.flags.ac2d20Roll;

				switch (rollData.diceFace) {
					case "d6":
						ac2d20.Roller2D20.rerollD6({
							rollName: rollData.rollName,
							rerollIndexes: rerollIndex,
							diceRolled: rollData.diceRolled,
							itemId: rollData.itemId,
							actorId: rollData.actorId,
						});
						break;
					case "d20":
						ac2d20.Roller2D20.rerollD20({
							rollName: rollData.rollName,
							rerollIndexes: rerollIndex,
							successThreshold: rollData.successThreshold,
							critThreshold: rollData.critThreshold,
							complicationThreshold: rollData.complicationThreshold,
							diceRolled: rollData.diceRolled,
						});
						break;
					default:
						ui.notifications.error(`Unrecognised dice face "${rollData.diceFace}`);
				}
			});
		});


		html.querySelectorAll(".dice-icon").forEach(element => {
			element.addEventListener("click", async event => {
				const target = event.currentTarget;
				if (target.classList.contains("dice-selected")) {
					target.classList.remove("dice-selected");
				}
				else {
					target.classList.add("dice-selected");
				}
			});
		});


		html.querySelectorAll(".add-button").forEach(element => {
			element.addEventListener("click", async ev => {
				const ac2d20Roll = message.flags.ac2d20Roll;
				const actorId = ac2d20Roll.actorId;
				const itemId = ac2d20Roll.itemId;

				game.ac2d20.DialogD6.createDialog({
					ac2d20Roll,
					actorId,
					diceNum: 1,
					itemId,
					rollName: ac2d20Roll.rollName,
				});
			});
		});
	}

}
