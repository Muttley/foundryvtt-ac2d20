export default class DialogEditTruth extends Dialog {

	constructor(dialogData = {}, options = {}) {
		super(dialogData, options);
	}


	static async createDialog({actorUuid, index = -1, truth = ""}) {
		let dialogData = {
			actorUuid,
			truth,
			index,
		};

		const html = await renderTemplate(
			"systems/ac2d20/templates/dialogs/edit-truth.hbs",
			dialogData
		);

		const label = index < 0
			? game.i18n.localize("AC2D20.TEMPLATES.ADD")
			: game.i18n.localize("AC2D20.TEMPLATES.SAVE");

		const title = index < 0
			? game.i18n.localize("AC2D20.TEMPLATES.AddTruth")
			: game.i18n.localize("AC2D20.TEMPLATES.EditTruth");

		const dialog = new DialogEditTruth({
			title,
			content: html,
			buttons: {
				edit: {
					icon: '<i class="fas fa-floppy-disk"></i>',
					label,
					callback: async html => {
						const actorUuid = html.find(".actorUuid").val() ?? "";
						const index = parseInt(html.find(".index").val()) ?? -1;

						let truth = html.find(".truth").val();

						// Strip any leading/trailing spaces
						truth = truth.replace(/^\s+|\s+$/g, "");

						if (truth === "") return; // do nothing

						const actor = await fromUuid(actorUuid);

						const currentTruths = foundry.utils.duplicate(
							actor.system.truths
						) ?? [];

						if (index < 0) {
							// Append new truth
							currentTruths.push(truth);
							actor.update({"system.truths": currentTruths});
						}
						else if (index <= currentTruths.length) {
							// Replace edited truth
							currentTruths[index] = truth;
							actor.update({"system.truths": currentTruths});
						}
						else {
							ac2d20.logger.error("Truth index out of range");
						}
					},
				},
			},
			default: "edit",
			close: () => { },
		});

		dialog.render(true);
	}
}
