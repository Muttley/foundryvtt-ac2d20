import { readyHook } from "../hooks/readyHook.mjs";
import { setupHook } from "../hooks/setupHook.mjs";
import { renderChatMessageHTMLHook } from "../hooks/renderChatMessageHTMLHook.mjs";

export const ACHooks = {
	attach: () => {
		ac2d20.logger.debug("Attaching hooks");

		const listeners = [
			readyHook,
			renderChatMessageHTMLHook,
			setupHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};
