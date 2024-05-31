import { ACUpdateBase } from "../ACUpdateBase.mjs";

export default class Update_240531_1 extends ACUpdateBase {
	static version = 240531.1;

	async updateActor(actorData) {
		if (actorData.type !== "vehicle") return;

		const updateData = {};

		for (const key in actorData.system.qualities) {
			const value = actorData.system.qualities[key].value;

			let rank = actorData.system.qualities[key].rank;
			rank = rank && rank >= 0 ? rank : 0;

			if (key === "cargo") {
				updateData[`system.qualities.-=${key}`] = null;
				updateData["system.qualities.cargo_x.rank"] = rank;
				updateData["system.qualities.cargo_x.value"] = value;
			}
			else if (key === "highPerformance") {
				updateData[`system.qualities.-=${key}`] = null;
				updateData["system.qualities.high_performance.rank"] = rank;
				updateData["system.qualities.high_performance.value"] = value;
			}
			else if (key === "singleSeat") {
				updateData[`system.qualities.-=${key}`] = null;
				updateData["system.qualities.single_seat.rank"] = rank;
				updateData["system.qualities.single_seat.value"] = value;
			}
			else if (key === "tough") {
				updateData[`system.qualities.-=${key}`] = null;
				updateData["system.qualities.tough_x.rank"] = rank;
				updateData["system.qualities.tough_x.value"] = value;
			}
		}

		return updateData;
	}
}
