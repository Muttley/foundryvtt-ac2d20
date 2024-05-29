import { ACUpdateBase } from "../ACUpdateBase.mjs";

export default class Update_240529_1 extends ACUpdateBase {
	static version = 240529.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;

		const updateData = {};

		const rename_effects = [
			"backlash",
			"persistent",
			"piercing",
		];

		for (const key in itemData.system.effect) {
			const value = itemData.system.effect[key].value;

			let rank =  itemData.system.effect[key].rank;
			rank = rank >= 0 ? rank : 0;

			if (rename_effects.includes(key)) {
				updateData[`system.effect.-=${key}`] = null;
				updateData[`system.effect.${key}_x.rank`] = rank;
				updateData[`system.effect.${key}_x.value`] = value;
			}
			else {
				updateData[`system.effect.${key}.-=description`] = null;
				updateData[`system.effect.${key}.-=label`] = null;
			}
		}

		return updateData;
	}

}
