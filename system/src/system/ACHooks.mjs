// import { hotbarDropHook } from "../hooks/hotbarDropHook.mjs";
// import { initiativeHooks } from "../hooks/initiativeHooks.mjs";
// import { preCreateItemHook } from "../hooks/preCreateItemHook.mjs";
import { readyHook } from "../hooks/readyHook.mjs";
// import { renderActorSheetHook } from "../hooks/renderActorSheetHook.mjs";
// import { renderChatMessageHook } from "../hooks/renderChatMessageHook.mjs";
// import { renderItemSheetHook } from "../hooks/renderItemSheetHook.mjs";
// import { settlementActorUpdateHooks } from "../hooks/settlementActorUpdateHooks.mjs";
import { setupHook } from "../hooks/setupHook.mjs";
import { renderChatMessageHook } from "../hooks/renderChatMessageHook.mjs";

export const ACHooks = {
	attach: () => {
		ac2d20.logger.debug("Attaching hooks");

		const listeners = [
			readyHook,
			renderChatMessageHook,
			setupHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};
