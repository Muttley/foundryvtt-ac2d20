export class ACChat {

	static async _renderChatMessage(
		actor,
		data,
		template,
		mode
	) {
		const html = await renderTemplate(template, data);

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
		ac2d20.logger.debug("Running renderChatMessage hook");

		const rerollButton = html.find(".reroll-button");

		if (rerollButton.length > 0) {
			rerollButton[0].setAttribute("data-messageId", message.id);

			rerollButton.click(el => {
				const selectedDiceForReroll = html.find(".dice-selected");

				const rerollIndex = [];
				for (const die of selectedDiceForReroll) {
					rerollIndex.push($(die).data("index"));
				}

				const rollData = message.flags.ac2d20Roll;

				switch (rollData.diceFace) {
					case "d6":
						ac2d20.Roller2D20.rerollD6({
							rollName: rollData.rollName,
							rerollIndexes: rerollIndex,
							diceRolled: rollData.diceRolled,
							itemId: message.flags.itemId,
							actorId: message.flags.actorId,
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
		}


		html.find(".dice-icon").click(el => {
			if ($(el.currentTarget).hasClass("dice-selected")) {
				$(el.currentTarget).removeClass("dice-selected");
			}
			else {
				$(el.currentTarget).addClass("dice-selected");
			}
		});


		const addButton = html.find(".add-button");
		if (addButton.length > 0) {
			addButton[0].setAttribute("data-messageId", message.id);

			addButton.click(ev => {
				const ac2d20Roll = message.flags.ac2d20Roll;
				const actorId = message.flags.actorId;
				const itemId = message.flags.itemId;

				game.ac2d20.DialogD6.createDialog({
					ac2d20Roll,
					actorId,
					diceNum: 1,
					itemId,
					rollName: ac2d20Roll.rollName,
				});
			});
		}
	}

}
