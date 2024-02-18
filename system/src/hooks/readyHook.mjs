import ACMigrationRunner from "../migrations/ACMigrationRunner.mjs";

export const readyHook = {
	attach: () => {
		ac2d20.logger.debug("Attaching ready hook");

		Hooks.once("ready", async () => {
			ac2d20.logger.debug("Running ready hook");

			if (game.user.isGM) {
				await new ACMigrationRunner().run();
			}

			prepareSkills();
			prepareTooltips();

			ac2d20.utils.showNewReleaseNotes();
		});
	},
};

async function prepareSkills() {
	const skillPackName = game.settings.get("ac2d20", "compendium-skills");

	let packSkills = await game.packs.get(skillPackName).getDocuments();

	let _skills = [];

	packSkills.forEach(s => {
		_skills.push({
			focuses: s.system.focuses.map(f => f.title),
			key: s.name,
			label: s.name.toUpperCase(),
		});
	});

	CONFIG.AC2D20.SKILLS = _skills.sort((a, b) => a.key.localeCompare(b.key));
}

async function prepareTooltips() {
	const listLocation = await game.settings.get("ac2d20", "hoversJsonLocation");

	const jsonFile = await fetch(listLocation);

	const content = await jsonFile.json();

	CONFIG.AC2D20.WEAPONS.effects = content.effects;
	CONFIG.AC2D20.WEAPONS.qualities = content.qualities;
	CONFIG.AC2D20.WEAPONS.vehiclesqualities = content.vehiclesqualities;

	for await (const key of Object.keys(content.effects)) {
		let qEnriched = await TextEditor.enrichHTML(content.effects[key], {async: true});
		content.effects[key] = qEnriched.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
	}

	for await (const key of Object.keys(content.qualities)) {
		let qEnriched = await TextEditor.enrichHTML(content.qualities[key], {async: true});
		content.qualities[key] = qEnriched.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
	}

	for await (const key of Object.keys(content.vehiclesqualities)) {
		let qEnriched = await TextEditor.enrichHTML(content.vehiclesqualities[key], {async: true});
		content.vehiclesqualities[key] = qEnriched.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
	}
}
