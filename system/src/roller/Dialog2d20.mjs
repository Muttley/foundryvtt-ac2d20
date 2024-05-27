export default class Dialog2d20 extends Dialog {

	constructor(
		rollName,
		diceNum,
		attribute,
		skill,
		focus,
		complication,
		actor,
		prefAttribute,
		actorId,
		itemId,
		dialogData={},
		options={}
	) {
		super(dialogData, options);

		this.actor = actor;
		this.actorId = actorId;
		this.attribute = attribute;
		this.complication = complication;
		this.diceNum = diceNum;
		this.focus = focus;
		this.itemId = itemId;
		this.prefAttribute = prefAttribute;
		this.rollName = rollName;
		this.skill = skill;

		this.options.classes = ["dice-icon"];
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.ready(e => {
			this.markDiceNumber(html, this.diceNum);
		});

		html.on("click", ".dice-icon", (e, i, a) => {
			let index = e.currentTarget.dataset.index;
			this.diceNum = parseInt(index);
			this.markDiceNumber(html, this.diceNum);
		});

		html.on("click", ".roll", event => {
			let attribute = html.find('[name="attribute"]').val();

			if (!attribute) {
				let attributeShortName = html.find(".select-attribute").val();
				attribute = this.actor.attributes[attributeShortName].value;
			}

			const skill = html.find('[name="skill"]').val();
			const complication = html.find('[name="complication"]').val();
			const isFocus = html.find('[name="focus"]').is(":checked");

			game.ac2d20.Roller2D20.rollD20({
				actorId: this.actorId,
				attribute,
				complication,
				dicenum: this.diceNum,
				focus: isFocus,
				itemId: this.itemId,
				rollName: this.rollName,
				skill,
			});
		});
	}

	markDiceNumber(html) {
		$(html).find(".dice-icon").removeClass("marked");
		$(html).find(`[data-index="${this.diceNum}"]`).addClass("marked");
	}

	static async createDialog({
		actor = null,
		actorId = null,
		attribute = 0,
		complication = 20,
		diceNum = 2,
		focus = false,
		itemId = null,
		prefAttribute = null,
		rollName = "Roll D20",
		skill = 0,
	} = {}) {
		let dialogData = {};
		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.attribute = attribute;
		dialogData.skill = skill;
		dialogData.focus = focus;
		dialogData.complication = complication;
		dialogData.attributes = ["agi", "bra", "coo", "ins", "rea", "wil"];
		dialogData.actor = actor;
		dialogData.prefAttribute = prefAttribute;
		dialogData.actorId = actorId;
		dialogData.itemId = itemId;

		const html = await renderTemplate(
			"systems/ac2d20/templates/dialogs/dialog2d20.hbs",
			dialogData
		);

		let d = new Dialog2d20(
			rollName,
			diceNum,
			attribute,
			skill,
			focus,
			complication,
			actor,
			prefAttribute,
			actorId,
			itemId,
			{
				title: rollName,
				content: html,
				buttons: {
					roll: {
						icon: '<i class="fas fa-check"></i>',
						label: "ROLL",
					},
				},
			}
		);
		d.render(true);
	}
}
