import { ACUpdateBase } from "../ACUpdateBase.mjs";

export default class Update_240526_2 extends ACUpdateBase {
	static version = 240526.2;

	async updateActor(actorData) {
		// Get rid of ancient legacy data that's no longer needed
		const updateData = {
			"system.injuries.-=list": null,
			"system.truths": [],
		};

		return updateData;
	}
}
