import { SYSTEM_ID } from "../config.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class MomentumTrackerV2
	extends HandlebarsApplicationMixin(ApplicationV2) {

	static #firstRun = true;

	static #instance;

	constructor(options = {}) {
		if (MomentumTrackerV2.#instance) {
			throw new Error("Attempted to create multiple instances of the MomentumTracker singleton.");
		}

		super(options);

		MomentumTrackerV2.#instance = this;
	}


	async #onChange(event, form, formData) {
		ac2d20.debug("MomentumTrackerV2::#onChange");

		const gmMomentum = game.settings.get(SYSTEM_ID, "gmMomentum");
		const partyMomentum = game.settings.get(SYSTEM_ID, "partyMomentum");

		const data = formData.object;

		// Only update if value has changed
		if (Object.keys(data).includes("gmMomentum")) {
			if (data.gmMomentum !== gmMomentum) {
				await MomentumTrackerV2.setCounter(data.gmMomentum, "gmMomentum");
			}
		}

		if (data.partyMomentum !== partyMomentum) {
			await MomentumTrackerV2.setCounter(data.partyMomentum, "partyMomentum");
		}

		return this.render(true);
	}


	static async #onSubmit(event, form, formData) {
		ac2d20.debug("MomentumTrackerV2::#onSubmit");
		if (event.type === "change") {
			return this.#onChange(event, form, formData);
		}

		return this.render(true);
	}


	static get instance() {
		if (!MomentumTrackerV2.#instance) {
			new MomentumTrackerV2(MomentumTrackerV2.DEFAULT_OPTIONS);
		}

		return MomentumTrackerV2.#instance;
	}


	static DEFAULT_OPTIONS = {
		actions: {
			decrementPool: MomentumTrackerV2._onDecrementPool,
			incrementPool: MomentumTrackerV2._onIncrementPool,
		},
		form: {
			closeOnSubmit: false,
			submitOnChange: true,
			handler: MomentumTrackerV2.#onSubmit,
		},
		id: "tracker",
		tag: "form",
		classes: ["ac2d20", "momentum-tracker"],
		window: {
			frame: false,
			positioned: false,
		},
	};


	static PARTS = {
		tracker: {
			root: true,
			template: templatePath("app/momentum-tracker"),
		},
	};


	/**
	 * Change the counter of (type) by (value)
	 * @param diff  How much to change the counter
	 * @param type  Type of counter, "momentum" or "threat"
	 */
	static async changeCounter(diff, type) {
		this.checkCounterUpdate(diff, type);

		const newValue = game.settings.get(SYSTEM_ID, type) + diff;
		await MomentumTrackerV2.setCounter(newValue, type);
	}


	// Check user entry. Rerender if error is detected to reset to the correct value
	static checkCounterUpdate(value, type) {
		const updateError = {
			counter: "Error updating Counter: Invalid Counter Type",
			value: "Error updating Counter: Invalid Value Type",
		};

		if (type !== "gmMomentum" && type !== "partyMomentum") {
			ui.notifications.error(updateError.counter);
			MomentumTrackerV2.instance.render({force: true});
			throw updateError.counter;
		}

		if (!value || Number.isNaN(value)) {
			ui.notifications.error(updateError.value);
			MomentumTrackerV2.instance.render({force: true});
			throw updateError.value;
		}
	}


	/**
	 * Set the counter of (type) to (value)
	 * @param value Value to set counter to
	 * @param type  Type of counter, "momentum" or "threat"
	 */
	static async setCounter(value, type) {
		if (!game.user.isGM) {
			game.socket.emit(`system.${SYSTEM_ID}`, {
				type: "setCounter",
				payload: {value, type},
			});
			return;
		}

		value = Number.parseInt(value);

		value = Math.max(0, value);

		if (type === "partyMomentum") {
			value = Math.min(game.settings.get(SYSTEM_ID, "maxMomentum"), value);
		}
		else {
			value = Math.min(99, value);
		}

		await game.settings.set(SYSTEM_ID, type, value);

		MomentumTrackerV2.instance.render({force: true});

		// Emit socket event for users to rerender their counters
		game.socket.emit(`system.${SYSTEM_ID}`, {type: "updateCounter"});
	}


	static async _onDecrementPool(event, target) {
		const {type} = target?.dataset ?? undefined;

		if (type) MomentumTrackerV2.changeCounter(-1, type);
	}


	static async _onIncrementPool(event, target) {
		const {type} = target?.dataset ?? undefined;

		if (type) MomentumTrackerV2.changeCounter(1, type);
	}


	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);

		// Move the element into the ui-left stack.
		const uiBottom = document.querySelector("#ui-bottom");
		if (!uiBottom) {
			dreams.error("Error: Could not find #ui-bottom!");
			return;
		}

		const hotbar = uiBottom.querySelector("#hotbar");
		if (!hotbar) {
			dreams.warn(
				"Could not find hotbar HTML element, appending Momentum Tracker to end of ui-bottom."
			);
			uiBottom.appendChild(this.element);
			return;
		}

		uiBottom.insertBefore(this.element, hotbar);
	}


	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		// Make sure the party momentum <= the max setting value
		if (this.#firstRun) {
			this.#firstRun = false;

			await game.settings.set(
				SYSTEM_ID, "partyMomentum",
				Math.min(
					game.settings.get(SYSTEM_ID, "maxMomentum"),
					game.settings.get(SYSTEM_ID, "partyMomentum")
				)
			);
		}

		context.gmMomentum = game.settings.get(SYSTEM_ID, "gmMomentum");
		context.isGM = game.user.isGM;
		context.maxMomentum = game.settings.get(SYSTEM_ID, "maxMomentum");
		context.partyMomentum = game.settings.get(SYSTEM_ID, "partyMomentum");

		context.showGMMomentum = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "gmMomentumShowToPlayers");

		return context;
	}
}
