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

		let rrlBtn = html.find(".reroll-button");
		if (rrlBtn.length > 0) {
			rrlBtn[0].setAttribute("data-messageId", message.id);
			rrlBtn.click(el => {
			// let selectedDiceForReroll = $(el.currentTarget).parent().find('.dice-selected');
				let selectedDiceForReroll = html.find(".dice-selected");
				let rerollIndex = [];
				for (let d of selectedDiceForReroll) {
					rerollIndex.push($(d).data("index"));
				}
				if (!rerollIndex.length) {
					ui.notifications.notify("Select Dice you want to Reroll");
				}
				else {
					let ac2d20Roll = message.flags.ac2d20roll;
					if (ac2d20Roll.diceFace === "d20") {
						ac2d20.Roller2D20.rerollD20({
							rollname: ac2d20Roll.rollname,
							rerollIndexes: rerollIndex,
							successTreshold: ac2d20Roll.successTreshold,
							critTreshold: ac2d20Roll.critTreshold,
							complicationTreshold: ac2d20Roll.complicationTreshold,
							dicesRolled: ac2d20Roll.dicesRolled,
						});
					}
					else if (ac2d20Roll.diceFace === "d6") {
						ac2d20.Roller2D20.rerollD6({
							rollname: ac2d20Roll.rollname,
							rerollIndexes: rerollIndex,
							dicesRolled: ac2d20Roll.dicesRolled,
							itemId: message.flags.itemId,
							actorId: message.flags.actorId,
						});
					}
					else {
						ui.notifications.notify("No dice face reckognized");
					}

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

		let addBtn = html.find(".add-button");
		if (addBtn.length > 0) {
			addBtn[0].setAttribute("data-messageId", message.id);
			addBtn.click(ev => {
				let ac2d20Roll = message.flags.ac2d20roll;
				let itemId = message.flags.itemId;
				let actorId = message.flags.actorId;
				game.ac2d20.DialogD6.createDialog({
					rollname: ac2d20Roll.rollname,
					diceNum: 1,
					ac2d20Roll: ac2d20Roll,
					itemId: itemId,
					actorId: actorId,
				});
			});
		}

	}
}
