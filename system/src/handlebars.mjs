export const registerHandlebarsHelpers = function() {

	/* -------------------------------------------- */
	/*  GENERAL HELPERS                             */
	/* -------------------------------------------- */
	Handlebars.registerHelper("concat", function() {
		let outStr = "";
		for (let arg in arguments) {
			if (typeof arguments[arg] != "object") {
				outStr += arguments[arg];
			}
		}
		return outStr;
	});

	Handlebars.registerHelper("fromConfig", function(arg1, arg2) {
		return CONFIG.AC2D20[arg1][arg2] ? CONFIG.AC2D20[arg1][arg2] : arg2;
	});

	Handlebars.registerHelper("toLowerCase", function(str) {
		return str.toLowerCase();
	});

	Handlebars.registerHelper("toUpperCase", function(str) {
		return str.toUpperCase();
	});

	Handlebars.registerHelper("subString", function(str, s, e) {
		return str.substring(s, e);
	});

	Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
		switch (operator) {
			case "==":
				// eslint-disable-next-line eqeqeq
				return v1 == v2 ? options.fn(this) : options.inverse(this);
			case "===":
				return v1 === v2 ? options.fn(this) : options.inverse(this);
			case "!=":
				// eslint-disable-next-line eqeqeq
				return v1 != v2 ? options.fn(this) : options.inverse(this);
			case "!==":
				return v1 !== v2 ? options.fn(this) : options.inverse(this);
			case "<":
				return v1 < v2 ? options.fn(this) : options.inverse(this);
			case "<=":
				return v1 <= v2 ? options.fn(this) : options.inverse(this);
			case ">":
				return v1 > v2 ? options.fn(this) : options.inverse(this);
			case ">=":
				return v1 >= v2 ? options.fn(this) : options.inverse(this);
			case "&&":
				return v1 && v2 ? options.fn(this) : options.inverse(this);
			case "||":
				return v1 || v2 ? options.fn(this) : options.inverse(this);
			default:
				return options.inverse(this);
		}
	});

	Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
		lvalue = parseFloat(lvalue);
		rvalue = parseFloat(rvalue);
		return {
			"+": lvalue + rvalue,
			"-": lvalue - rvalue,
			"*": lvalue * rvalue,
			"/": lvalue / rvalue,
			"%": lvalue % rvalue,
		}[operator];
	});

	/* -------------------------------------------- */
	/*  AC2D20 HELPERS                             */
	/* -------------------------------------------- */

	Handlebars.registerHelper("damageFaIconClass", function(str) {
		if (str === "physical") return "fas fa-fist-raised";
		else if (str === "energy") return "fas fa-bolt";
		else if (str === "radiation") return "fas fa-radiation";
		else if (str === "poison") return "fas fa-biohazard";
	});

	Handlebars.registerHelper("getSkillFocusList", function(key) {
		if (key === "") return [];
		const _skill = CONFIG.AC2D20.SKILLS.filter(s => s.key === key);
		return _skill[0]?.focuses ?? [];
	});

	Handlebars.registerHelper("getWeaponEffects", function(effect) {
		let effects = [];
		Object.entries(effect).forEach(([k, v]) => {
			let effString = "";
			let tooltip = "";
			let locString = "";
			if (v.value) {
				let tstr = `AC2D20.WEAPONS.effects.${k}`;
				let lstr = `AC2D20.WEAPONS.damageEffect.${k}`;
				tooltip = Handlebars.helpers.getTooltipFromConfigKey(tstr);
				locString = game.i18n.localize(lstr);
				effString += `<span data-tooltip="${tooltip}">${locString}`;
				if (v.rank) {
					effString += ` ${v.rank}`;
				}
				effString += "</span>";
				effects.push(effString);
			}
		});
		return effects.join(", ");
	});

	Handlebars.registerHelper("getWeaponQualities", function(qualities) {
		let _qualities = [];
		Object.entries(qualities).forEach(([k, v]) => {
			let quString = "";
			let tooltip = "";
			let locString = "";
			if (v.value) {
				let tstr = `AC2D20.WEAPONS.qualities.${k}`;
				let lstr = `AC2D20.WEAPONS.weaponQuality.${k}`;
				tooltip = Handlebars.helpers.getTooltipFromConfigKey(tstr);
				locString = game.i18n.localize(lstr);
				quString += `<span data-tooltip="${tooltip}">${locString}</span>`;
				_qualities.push(quString);
			}
		});
		return _qualities.join(", ");
	});

	Handlebars.registerHelper("isCreaturesWeapon", function(weapon) {
		if (weapon.system.weaponType === "creatureAttack" || weapon.actor?.type === "creature") return true;
		else return false;
	});

	Handlebars.registerHelper("isWeaponUsingMeleeBonus", function(weapon, actor) {
		if ((weapon.weaponType === "unarmed" || weapon.weaponType === "meleeWeapons") && actor?.type !== "creature") return true;
		else return false;
	});

	Handlebars.registerHelper("hasInjury", function(txt) {
		if (txt.length > 0) return true;
		else return false;
	});

	Handlebars.registerHelper("getAttributeBonus", function(actor, weaponType) {
		if (weaponType === "agi") return actor.system.attributes.bra.bonus;
		else if (weaponType === "coo") return actor.system.attributes.ins.bonus;
		else if (weaponType === "wil") return actor.system.attributes.wil.bonus;
	});

	Handlebars.registerHelper("getArmorQualities", function(qualities) {
		let qual = Object.entries(qualities).filter(([k, v]) => v.value).map(m => m[0]);
		return qual;
	});

	Handlebars.registerHelper("getSizeLabel", function(num) {
		switch (parseInt(num) ?? null) {
			case 0:
				return "Trivial";
			case 1:
				return "Minor";
			case 3:
				return "Major";
			default:
				return "-";
		}
	});


	Handlebars.registerHelper("clearTextAreaText", function(txt) {
		txt.trim();
		txt = txt.replace(/  +/g, " ");
		// ! replace new lines with encided \n so stupid textarea doesn't break
		txt = txt.replace(/(?:\r\n|\r|\n)/g, "&#13;&#10;");
		return txt;
	});

	// FOR TIMES LOOP
	Handlebars.registerHelper("times", function(n, block) {
		let accum = "";
		for (let i = 0; i < n; ++i) accum += block.fn(i);
		return accum;
	});

	// * Use with #if
	// {{#if (or
	// (eq section1 "foo")
	// (ne section2 "bar"))}}
	// .. content
	// {{/if}}
	Handlebars.registerHelper({
		eq: (v1, v2) => v1 === v2,
		ne: (v1, v2) => v1 !== v2,
		lt: (v1, v2) => v1 < v2,
		gt: (v1, v2) => v1 > v2,
		lte: (v1, v2) => v1 <= v2,
		gte: (v1, v2) => v1 >= v2,
		and() {
			return Array.prototype.every.call(arguments, Boolean);
		},
		or() {
			return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
		},
	});

	Handlebars.registerHelper("getTooltipFromConfigKey", function(key) {
		return key.split(".").reduce((o, i) => o[i], CONFIG);
	});
};
