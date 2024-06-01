export default class MomentumTracker extends Application {
	constructor(options = {}) {
		if (MomentumTracker._instance) {
			throw new Error("MomentumTracker already has an instance!!!");
		}

		super(options);

		MomentumTracker._instance = this;
		MomentumTracker.closed = true;
	}

	// override
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["ac2d20", "momentum-tracker"],
			height: "200",
			id: "momentum-tracker-app",
			popOut: false,
			resizable: false,
			template: "systems/ac2d20/templates/app/momentum-tracker.hbs",
			title: "AP Tracker",
			width: "auto",
		});
	}

	// override
	getData() {
		const data = {
			gmMomentum: game.settings.get(SYSTEM_ID, "gmMomentum"),
			isGM: game.user.isGM,
			maxMomentum: game.settings.get(SYSTEM_ID, "maxMomentum"),
			partyMomentum: game.settings.get(SYSTEM_ID, "partyMomentum"),
		};

		data.showGMMomentum = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "gmMomentumShowToPlayers");

		data.showMaxApp = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "maxAppShowToPlayers");

		return data;
	}

	static renderApTracker() {
		if (MomentumTracker._instance) MomentumTracker._instance.render(true);
	}

	activateListeners(html) {
		super.activateListeners(html);

		if (MomentumTracker.closed) {
			html.find(".ap-resource.maxMomentum-box").css("display", "none");
		}

		html.find(".ap-input").change(ev => {
			const type = $(ev.currentTarget).parents(".ap-resource").attr("data-type");
			const value = ev.target.value;

			MomentumTracker.setAP(type, value);
		});

		html.find(".ap-add, .ap-sub").click(ev => {
			const type = $(ev.currentTarget).parents(".ap-resource").attr("data-type");
			const change = $(ev.currentTarget).hasClass("ap-add") ? 1 : -1;

			const currentValue = game.settings.get(SYSTEM_ID, type);
			const newValue = parseInt(currentValue) + change;

			MomentumTracker.setAP(type, newValue);
		});

		html.find(".toggle-maxAp").click(ev => {
			html.find(".ap-resource.maxMomentum-box").slideToggle("fast", function() {
				MomentumTracker.closed = !MomentumTracker.closed;
			});
		});
	}

	static async adjustAP(type, diff) {
		if (!game.user.isGM) {
			game.socket.emit("system.ac2d20", {
				operation: "adjustAP",
				data: { diff, type },
			});
			return;
		}

		diff = Math.round(diff);

		let momentum = game.settings.get(SYSTEM_ID, type);
		momentum += diff;

		this.setAP(type, momentum);
	}


	static async setAP(type, value) {
		if (!game.user.isGM) {
			game.socket.emit("system.ac2d20", {
				operation: "setAP",
				data: { value: value, type: type },
			});
			return;
		}

		value = Math.round(value);
		value = Math.max(0, value);

		const maxMomentum = await game.settings.get(SYSTEM_ID, "maxMomentum");

		if (type === "partyMomentum") value = Math.min(value, maxMomentum);

		if (type === "maxMomentum") {
			const currentPartyMomentum =
				await game.settings.get(SYSTEM_ID, "partyMomentum");

			const newPartyMomentum = Math.min(value, currentPartyMomentum);

			await game.settings.set(SYSTEM_ID, "partyMomentum", newPartyMomentum);
		}

		await game.settings.set(SYSTEM_ID, type, value);

		MomentumTracker.renderApTracker();

		// emit socket event for the players to update
		game.socket.emit("system.ac2d20", { operation: "updateAP" });
	}

	static updateAP() {
		MomentumTracker.renderApTracker();
	}
}

Hooks.once("ready", () => {
	if (MomentumTracker._instance) return;

	new MomentumTracker();

	MomentumTracker.renderApTracker();

	game.socket.on("system.ac2d20", ev => {
		if (ev.operation === "adjustAP") {
			if (game.user.isGM) MomentumTracker.adjustAP(ev.data.type, ev.data.diff);
		}

		if (ev.operation === "setAP") {
			if (game.user.isGM) MomentumTracker.setAP(ev.data.type, ev.data.value);
		}

		if (ev.operation === "updateAP") MomentumTracker.updateAP();
	});
});
