export default class DialogD6 extends Dialog {

	constructor(rollName, diceNum, dialogData = {}, options = {}) {
		super(dialogData, options);
		this.rollName = rollName;
		this.diceNum = diceNum;
		this.options.classes = ["dice-icon"];
	}

	static async createDialog({
		rollName = "Challenge Roll",
		diceNum = 2,
		ac2d20Roll = null,
		itemId = null,
		actorId = null,
	}={}) {
		let dialogData = {};
		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.ac2d20Roll = ac2d20Roll;
		dialogData.itemId = itemId;
		dialogData.actorId = actorId;

		const html = `
			<div class="flexrow ac2d20-dialog">
				<div class="flexrow resource" style="padding:5px">
					<label class="title-label">
						Number of Dice:
					</label>
					<input type="number" class="d-number" value="${diceNum}">
				</div>
			</div>`;

		let d = new DialogD6(rollName, diceNum, {
			title: rollName,
			content: html,
			buttons: {
				roll: {
					icon: '<i class="fas fa-check"></i>',
					label: "ROLL",
					callback: html => {
						let diceNum = html.find(".d-number")[0].value;
						if (!ac2d20Roll) {
							game.ac2d20.Roller2D20.rollD6({
								rollname: rollName,
								dicenum: parseInt(diceNum),
								itemId: itemId,
								actorId: actorId,
							});
						}
						else {
							game.ac2d20.Roller2D20.addD6({
								rollname: rollName,
								dicenum: parseInt(diceNum),
								ac2d20Roll: ac2d20Roll,
								itemId: itemId,
								actorId: actorId,
							});
						}
					},
				},
			},
			default: "roll",
			close: () => { },
		});
		d.render(true);
	}
}
