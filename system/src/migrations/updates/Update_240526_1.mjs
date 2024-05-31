import { ACUpdateBase } from "../ACUpdateBase.mjs";

export default class Update_240526_1 extends ACUpdateBase {
	static version = 240526.1;

	async updateActor(actorData) {
		if (actorData.type !== "vehicle") return;

		const singleSeatValue =
			actorData.system?.qualities["singleSeat:"]?.value ?? false;

		const updateData = {
			"system.qualities.-=singleSeat:": null,
			"system.qualities.singleSeat.value": singleSeatValue,
		};

		for (const [key] of Object.entries(actorData?.system?.qualities ?? {})) {
			if (key === "singleSeat:") continue;

			updateData[`system.qualities.${key}.-=description`] = null;
		}

		return updateData;
	}
}
