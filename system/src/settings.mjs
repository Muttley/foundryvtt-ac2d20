const debounceReload = debounce(() => window.location.reload(), 100);

export function registerSettings() {

	// ------------------
	//  MOMENTUM TRACKER
	// ------------------
	//
	game.settings.register(SYSTEM_ID, "partyMomentum", {
		name: "Party Momentum",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "gmMomentum", {
		name: "GM Momentum",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "maxMomentum", {
		name: "Max Momentum",
		scope: "world",
		config: false,
		default: 6,
		type: Number,
	});

	// -------------------
	//  STANDARD SETTINGS
	// -------------------
	//
	game.settings.register(SYSTEM_ID, "gmMomentumShowToPlayers", {
		name: game.i18n.localize("AC2D20.SETTINGS.showmomentumName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.showmomentumHint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "maxAppShowToPlayers", {
		name: game.i18n.localize("AC2D20.SETTINGS.maxappName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.maxappHint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "compendium-skills", {
		name: game.i18n.localize("AC2D20.SETTINGS.compendiumName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.compendiumHint"),
		scope: "world",
		config: true,
		default: "ac2d20.skills",
		type: String,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "hoversJsonLocation", {
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

	game.settings.register(SYSTEM_ID, "combatTrackerMomentumUpdate", {
		name: game.i18n.localize("AC2D20.SETTINGS.ctName"),
		hint: game.i18n.localize("AC2D20.SETTINGS.ctHint"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	// ----------------
	//  DEBUG SETTINGS
	// ----------------
	//
	game.settings.register(SYSTEM_ID, "debugEnabled", {
		name: game.i18n.localize("AC2D20.SETTINGS.debugEnabled.label"),
		hint: game.i18n.localize("AC2D20.SETTINGS.debugEnabled.hint"),
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "worldSchemaVersion", {
		name: game.i18n.localize("AC2D20.SETTINGS.worldSchemaVersion.label"),
		hint: game.i18n.localize("AC2D20.SETTINGS.worldSchemaVersion.hint"),
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: -1,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "systemVersion", {
		name: game.i18n.localize("AC2D20.SETTINGS.systemVersion.label"),
		hint: game.i18n.localize("AC2D20.SETTINGS.systemVersion.hint"),
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: "",
		type: String,
	});

	game.settings.register(SYSTEM_ID, "migrateSystemCompendiums", {
		name: game.i18n.localize("AC2D20.SETTINGS.migrateSystemCompendiums.label"),
		hint: game.i18n.localize("AC2D20.SETTINGS.migrateSystemCompendiums.label"),
		scope: "world",
		type: Boolean,
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: false,
		requiresReload: true,
	});

}
