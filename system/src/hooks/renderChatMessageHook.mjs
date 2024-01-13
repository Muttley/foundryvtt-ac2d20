import { ACChat } from "../system/ACChat.mjs";

export const renderChatMessageHook = {
	attach: () => {
		ac2d20.logger.debug("Attaching renderChatMessage hook");

		Hooks.on("renderChatMessage", ACChat.onRenderChatMessage);
	},
};
