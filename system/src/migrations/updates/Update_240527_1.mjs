import { ACUpdateBase } from "../ACUpdateBase.mjs";

export default class Update_240527_1 extends ACUpdateBase {
	static version = 240527.1;

	// Update the actor to the latest schema version.
	//
	async updateActor(actorData) {
		const truthsText = actorData.system.truthsText ?? "";
		if (truthsText === "") return;

		const lines = truthsText.split("\n");

		const newTruths = [];
		for (let truth of lines) {
			truth = truth.replace(/^\s+|\s+$/g, "");
			if (truth === "") continue; // do nothing

			newTruths.push(truth);
		}

		const updateData = {
			"system.-=truthsText": null,
			"system.truths": newTruths,
		};

		return updateData;
	}
}
