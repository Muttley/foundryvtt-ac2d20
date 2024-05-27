export default class ACUtils {

	static foundryMinVersion(version) {
		const majorVersion = parseInt(game.version.split(".")[0]);
		return majorVersion >= version;
	}


	static async getAvailableItemCompendiumSelectData() {
		const compendiumChoices = {};

		game.packs.filter(
			pack => pack.metadata.type === "Item"
		).sort(
			(a, b) => a.metadata.label.localeCompare(b.metadata.label)
		).forEach(
			pack => {
				compendiumChoices[pack.metadata.id] = pack.metadata.label;
			}
		);

		return compendiumChoices;
	}


	static getLocalizedFocusName(name) {
		const i18nKey = `AC2D20.FOCUS.${name}`;
		return this.getLocalizedStringIfAvailable(i18nKey, name);
	}


	static getLocalizedSkillName(name) {
		const i18nKey = `AC2D20.SKILL.${name.toUpperCase()}`;
		return this.getLocalizedStringIfAvailable(i18nKey, name);
	}


	static getLocalizedStringIfAvailable(i18nKey, originalString) {
		let localized = game.i18n.localize(i18nKey);

		// No localized version, so we return the original
		if (localized === i18nKey) return originalString;

		return localized;
	}


	static getMessageStyles() {
		const messageStyles = this.foundryMinVersion(12)
			? CONST.CHAT_MESSAGE_STYLES
			: CONST.CHAT_MESSAGE_TYPES;

		return messageStyles;
	}


	// If this is a new release or a new world, show the release notes to the
	// GM the first time they login
	//
	static async showNewReleaseNotes() {
		if (game.user.isGM) {
			const savedVersion = game.settings.get("ac2d20", "systemVersion");
			const systemVersion = game.system.version;

			if (systemVersion !== savedVersion) {
				Hotbar.toggleDocumentSheet(
					CONFIG.AC2D20.JOURNAL_UUIDS.releaseNotes
				);

				game.settings.set(
					"ac2d20", "systemVersion",
					systemVersion
				);
			}
		}
	}
}
