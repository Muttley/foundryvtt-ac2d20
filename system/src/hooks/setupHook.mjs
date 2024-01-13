export const setupHook = {
	attach: () => {
		Hooks.once("setup", () => {
			// Go through the CONFIG object and attempt to localize any Strings
			// up front
			for (const obj in CONFIG.AC2D20) {
				if ({}.hasOwnProperty.call(CONFIG.AC2D20, obj)) {
					for (const el in CONFIG.AC2D20[obj]) {
						if ({}.hasOwnProperty.call(CONFIG.AC2D20[obj], el)) {
							if (typeof CONFIG.AC2D20[obj][el] === "string") {
								CONFIG.AC2D20[obj][el] = game.i18n.localize(
									CONFIG.AC2D20[obj][el]
								);
							}
						}
					}
				}
			}
		});
	},
};
