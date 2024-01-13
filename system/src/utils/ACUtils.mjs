export default class ACUtils {

	// If this is a new release, show the release notes to the GM the first time
	// they login
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
