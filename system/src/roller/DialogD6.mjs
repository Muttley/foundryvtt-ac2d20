export default class DialogD6 extends Dialog {

	constructor(dialogData = {}, options = {}) {
		super(dialogData, options);

		this.options.classes = ["dice-icon"];
	}

	static async createDialog({
		ac2d20Roll = null,
		actorId = null,
		diceNum = 2,
		itemId = null,
		rollName = "Challenge Roll",
	}={}) {
		const dialogData = {
			ac2d20Roll,
			actorId,
			diceNum,
			itemId,
			rollName,
		};

		const html = await foundry.applications.handlebars.renderTemplate(
			"systems/ac2d20/templates/dialogs/dialogD6.hbs",
			dialogData
		);

		const dialog = new DialogD6({
			title: rollName,
			content: html,
			buttons: {
				roll: {
					icon: '<i class="fas fa-check"></i>',
					label: "ROLL",
					callback: html => {
						const diceNum = parseInt(
							html.find(".d-number")[0].value
						);

						if (isNaN(diceNum) || diceNum <= 0) {
							return ui.notifications.error(
								game.i18n.localize("AC2D20.Error.NumberOfDiceMustBeNonZero")
							);
						}

						const rollOptions = {
							actorId,
							diceNum,
							itemId,
							rollName,
						};

						if (ac2d20Roll) {
							rollOptions.ac2d20Roll = ac2d20Roll;

							game.ac2d20.Roller2D20.addD6(rollOptions);
						}
						else {
							game.ac2d20.Roller2D20.rollD6(rollOptions);
						}
					},
				},
			},
			default: "roll",
			close: () => {},
		});

		dialog.render(true);
	}
}
