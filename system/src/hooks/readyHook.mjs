import { prepareSkills } from "../config.mjs";
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

			ac2d20.utils.showNewReleaseNotes();
		});
	},
};
