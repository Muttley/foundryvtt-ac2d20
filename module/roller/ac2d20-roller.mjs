export class Roller2D20 {
    dicesRolled = [];
    successTreshold = 0;
    critTreshold = 0;
    complicationTreshold = 20;
    successes = 0;

    static async rollD20({ rollname = "Roll xD20", dicenum = 2, attribute = 0, skill = 0, focus = false, difficulty = 1, complication = 20 } = {}) {
        let dicesRolled = [];
        let successTreshold = parseInt(attribute) + parseInt(skill);
        let critTreshold = focus ? parseInt(skill) : 1;
        let complicationTreshold = parseInt(complication);
        let formula = `${dicenum}d20`;
        let roll = new Roll(formula);
        await roll.evaluate({ async: true });
        await Roller2D20.parseD20Roll({
            rollname: rollname,
            roll: roll,
            successTreshold: successTreshold,
            critTreshold: critTreshold,
            complicationTreshold: complicationTreshold
        });
    }

    static async parseD20Roll({ rollname = "Roll xD20", roll = null, successTreshold = 0, critTreshold = 1, complicationTreshold = 20, dicesRolled = [], rerollIndexes = [] }) {
        let i = 0;
        roll.dice.forEach(d => {
            d.results.forEach(r => {
                let diceSuccess = 0;
                let diceComplication = 0;
                if (r.result <= successTreshold) {
                    diceSuccess++;
                }
                if (r.result <= critTreshold) {
                    diceSuccess++;
                }
                if (r.result >= complicationTreshold) {
                    diceComplication = 1;
                }
                // if there are no rollIndexes sent then it is a new roll. Otherwise it's a re-roll and we should replace dices at given indexes
                if (!rerollIndexes.length) {
                    dicesRolled.push({ success: diceSuccess, reroll: false, result: r.result, complication: diceComplication });
                }
                else {
                    dicesRolled[rerollIndexes[i]] = { success: diceSuccess, reroll: true, result: r.result, complication: diceComplication };
                    i++;
                }
            })
        });
        await Roller2D20.sendToChat({
            rollname: rollname,
            roll: roll,
            successTreshold: successTreshold,
            critTreshold: critTreshold,
            complicationTreshold: complicationTreshold,
            dicesRolled: dicesRolled,
            rerollIndexes: rerollIndexes
        });
    }

    static async rerollD20({ rollname = "Roll xD20", roll = null, successTreshold = 0, critTreshold = 1, complicationTreshold = 20, dicesRolled = [], rerollIndexes = [] } = {}) {
        if (!rerollIndexes.length) {
            ui.notifications.notify('Select Dice you want to Reroll');
            return;
        }
        let numOfDice = rerollIndexes.length;
        let formula = `${numOfDice}d20`;
        let _roll = new Roll(formula);
        await _roll.evaluate({ async: true });
        await Roller2D20.parseD20Roll({
            rollname: `${rollname} re-roll`,
            roll: _roll,
            successTreshold: successTreshold,
            critTreshold: critTreshold,
            complicationTreshold: complicationTreshold,
            dicesRolled: dicesRolled,
            rerollIndexes: rerollIndexes
        });
    }

    static async sendToChat({ rollname = "Roll xD20", roll = null, successTreshold = 0, critTreshold = 1, complicationTreshold = 20, dicesRolled = [], rerollIndexes = [] } = {}) {
        let successesNum = Roller2D20.getNumOfSuccesses(dicesRolled);
        let complicationsNum = Roller2D20.getNumOfComplications(dicesRolled);
        let rollData = {
            rollname: rollname,
            successes: successesNum,
            complications: complicationsNum,
            results: dicesRolled,
            successTreshold: successTreshold
        }
        const html = await renderTemplate("systems/ac2d20/templates/chat/roll2d20.html", rollData);
        let ac2d20Roll = {}
        ac2d20Roll.rollname = rollname;
        ac2d20Roll.dicesRolled = dicesRolled;
        ac2d20Roll.successTreshold = successTreshold;
        ac2d20Roll.critTreshold = critTreshold;
        ac2d20Roll.complicationTreshold = complicationTreshold;
        ac2d20Roll.rerollIndexes = rerollIndexes;
        ac2d20Roll.diceFace = "d20";
        let chatData = {
            user: game.user.id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            flags: { ac2d20roll: ac2d20Roll },
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: roll,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        await ChatMessage.create(chatData);
    }

    static getNumOfSuccesses(results) {
        let s = 0;
        results.forEach(d => {
            s += d.success;
        });
        return s;
    }

    static getNumOfComplications(results) {
        let r = 0;
        results.forEach(d => {
            r += d.complication;
        });
        return r;
    }

    static async rollD6({ rollname = "Roll D6", dicenum = 2, weapon = null } = {}) {
        let formula = `${dicenum}ds`;
        let roll = new Roll(formula);
        await roll.evaluate({ async: true });
        await Roller2D20.parseD6Roll({
            rollname: rollname,
            roll: roll,
            weapon: weapon
        });
    }

    static async parseD6Roll({ rollname = "Roll D6", roll = null, dicesRolled = [], rerollIndexes = [], addDice = [], weapon = null } = {}) {
        let diceResults = [
            { result: 1, effect: 0 },
            { result: 2, effect: 0 },
            { result: 0, effect: 0 },
            { result: 0, effect: 0 },
            { result: 1, effect: 1 },
            { result: 1, effect: 1 },
        ];

        let i = 0;
        roll.dice.forEach(d => {
            d.results.forEach(r => {
                let diceResult = diceResults[r.result - 1];
                diceResult.face = r.result;
                // if there are no rollIndexes sent then it is a new roll. Otherwise it's a re-roll and we should replace dices at given indexes
                if (!rerollIndexes.length) {
                    dicesRolled.push(diceResult);
                }
                else {
                    dicesRolled[rerollIndexes[i]] = diceResult;
                    i++;
                }
            });
        });

        if (addDice.length) {
            dicesRolled = addDice.concat(dicesRolled);
        }

        await Roller2D20.sendD6ToChat({
            rollname: rollname,
            roll: roll,
            dicesRolled: dicesRolled,
            rerollIndexes: rerollIndexes,
            weapon: weapon
        });
    }

    static async rerollD6({ rollname = "Roll D6", roll = null, dicesRolled = [], rerollIndexes = [], weapon = null } = {}) {
        if (!rerollIndexes.length) {
            ui.notifications.notify('Select Dice you want to Reroll');
            return;
        }
        let numOfDice = rerollIndexes.length;
        let formula = `${numOfDice}ds`;
        let _roll = new Roll(formula);
        await _roll.evaluate({ async: true });
        await Roller2D20.parseD6Roll({
            rollname: `${rollname} [re-roll]`,
            roll: _roll,
            dicesRolled: dicesRolled,
            rerollIndexes: rerollIndexes,
            weapon: weapon
        });
    }

    static async addD6({ rollname = "Roll D6", dicenum = 2, ac2d20Roll = null, dicesRolled = [], weapon = null } = {}) {
        let formula = `${dicenum}ds`;
        let _roll = new Roll(formula);
        await _roll.evaluate({ async: true });
        let newRollName = `${ac2d20Roll.rollname} [+ ${dicenum} DC]`;
        let oldDiceRolled = ac2d20Roll.dicesRolled;
        await Roller2D20.parseD6Roll({
            rollname: newRollName,
            roll: _roll,
            dicesRolled: dicesRolled,
            addDice: oldDiceRolled,
            weapon: weapon
        });
    }

    static async sendD6ToChat({ rollname = "Roll D6", roll = null, dicesRolled = [], rerollIndexes = [], weapon = null } = {}) {
        let damage = dicesRolled.reduce((a, b) => ({ result: a.result + b.result })).result;
        let effects = dicesRolled.reduce((a, b) => ({ effect: a.effect + b.effect })).effect;
        let weaponDamageTypesList = [];
        let weaponDamageEffectsList = [];
        let weaponQualityList = [];

        if (weapon != null) {
            // weaponDamageTypesList = Object.keys(weapon.data.damage.damageType).filter((dt) => {
            //     if (weapon.data.damage.damageType[dt]) return dt;
            // });
            //console.warn(weapon)
            for (let de in weapon.data.effect) {
                if (weapon.data.effect[de].value) {
                    let rank = weapon.data.effect[de].rank ?? "";
                    let damageEffectLabel = game.i18n.localize(`AC2D20.WEAPONS.damageEffect.${de}`);
                    let efectLabel = `${damageEffectLabel}${rank}`;
                    weaponDamageEffectsList.push(efectLabel);
                }
            }

            for (let qu in weapon.data.qualities) {
                if (weapon.data.qualities[qu].value) {
                    //let rank = weapon.data.data.effect[qu].rank ?? "";
                    let quLabel = game.i18n.localize(`AC2D20.WEAPONS.qualities.${qu}`);
                    //let quLabel = `${damageEffectLabel}${rank}`;
                    weaponQualityList.push(quLabel);
                }
            }
        }
        let weaponDamageEffects = weaponDamageEffectsList.join(', ');
        let rollData = {
            rollname: rollname,
            damage: damage,
            effects: effects,
            results: dicesRolled,
            weaponDamageTypesList: weaponDamageTypesList,
            weaponDamageEffects: weaponDamageEffects,
            weaponQualityList: weaponQualityList
        }
        const html = await renderTemplate("systems/ac2d20/templates/chat/rollD6.html", rollData);
        let ac2d20Roll = {}
        ac2d20Roll.rollname = rollname;
        ac2d20Roll.dicesRolled = dicesRolled;
        ac2d20Roll.damage = damage;
        ac2d20Roll.effects = effects;
        ac2d20Roll.rerollIndexes = rerollIndexes;
        ac2d20Roll.diceFace = "d6";

        let chatData = {
            user: game.user.id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            flags: { ac2d20roll: ac2d20Roll, weapon: weapon },
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: roll,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        await ChatMessage.create(chatData);

    }
}

