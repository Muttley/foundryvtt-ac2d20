import { ACUpdateBase } from "../ACUpdateBase.mjs";

export default class Update_240530_1 extends ACUpdateBase {
	static version = 240530.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;

		const updateData = {};

		for (const key in itemData.system.qualities) {
			const value = itemData.system.qualities[key].value;

			if (key === "closeQuarters") {
				updateData[`system.qualities.-=${key}`] = null;
				updateData["system.qualities.close_quarters.value"] = value;
			}
			else if (key === "giant-killer") {
				updateData[`system.qualities.-=${key}`] = null;
				updateData["system.qualities.giant_killer.value"] = value;
			}
			else {
				updateData[`system.qualities.${key}.-=description`] = null;
				updateData[`system.qualities.${key}.-=label`] = null;
			}
		}

		return updateData;
	}

}
