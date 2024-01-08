const debounceReload = debounce(() => window.location.reload(), 100);

export function registerSettings() {
	game.settings.register("ac2d20", "partyMomentum", {
		name: "Party Momentum",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register("ac2d20", "gmMomentum", {
		name: "GM Momentum",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register("ac2d20", "maxMomentum", {
		name: "Max Momentum",
		scope: "world",
		config: false,
		default: 6,
		type: Number,
	});

	game.settings.register("ac2d20", "gmMomentumShowToPlayers", {
		name: game.i18n.localize("AC2D20.SETTINGS.showmomentumName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.showmomentumHint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("ac2d20", "maxAppShowToPlayers", {
		name: game.i18n.localize("AC2D20.SETTINGS.maxappName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.maxappHint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("ac2d20", "compendium-skills", {
		name: game.i18n.localize("AC2D20.SETTINGS.compendiumName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.compendiumHint"),
		scope: "world",
		config: true,
		default: "ac2d20.skills",
		type: String,
	});

	game.settings.register("ac2d20", "hoversJsonLocation", {
		name: game.i18n.localize("AC2D20.SETTINGS.hoverName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.hoverHint"),
		scope: "world",
		config: true,
		default: "systems/ac2d20/assets/hovers.json",
		type: String,
		filePicker: true,
		restricted: true,
		onChange: debounceReload,
	});

	game.settings.register("ac2d20", "combatTrackerMomentumUpdate", {
		name: game.i18n.localize("AC2D20.SETTINGS.ctName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.ctHint"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
}
