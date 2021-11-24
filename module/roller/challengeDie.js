export default class DieACChallenge extends DiceTerm {
    constructor(termData) {
        super(termData);
        this.faces = 6;
        console.warn(this.faces)
    }

    static DENOMINATION = 'p';

    static values = {
        1: 1,
        2: 2,
        3: 0,
        4: 0,
        5: "<img width='24' height='24' style='border: none' src='systems/ac2d20/assets/dice/d5.webp'/>",
        6: "<img width='24' height='24' style='border: none' src='systems/conan2d20/assets/dice/d6.webp'/>",
    };

    /**
     * @return the results as CombatDice values: 0,1,2,phoenix.
     */
    static getResultLabel(result) {
        // Return blank if 0, otherwise just get the value
        return DieACChallenge.values[result] ? DieACChallenge.values[result] : '&nbsp';
    }

    /** @override */
    // getResultLabel(result) {
    //     return {
    //         "1": '<img src="systems/ac2d20/assets/dice/d1.webp" />',
    //         "2": '<img src="systems/ac2d20/assets/dice/d2.webp" />',
    //         "3": '<img src="systems/ac2d20/assets/dice/d3.webp" />',
    //         "4": '<img src="systems/ac2d20/assets/dice/d4.webp" />',
    //         "5": '<img src="systems/ac2d20/assets/dice/d5.webp" />',
    //         "6": '<img src="systems/ac2d20/assets/dice/d6.webp" />'
    //     }[result.result];
    // }

    /** @override */
    get total() {
        if (!this._evaluated) return null;
        return this.results.reduce((t, r) => {
            if (!r.active) return t;
            if (r.count !== undefined) return t + r.count;
            return t + DieACChallenge.getValue(r.result);
        }, 0);
    }

    /** @override */
    roll(options) {
        const roll = super.roll(options);
        roll.effect = roll.result === 5 || roll.result === 6;
        return roll;
    }

    get resultValues() {
        return this.results.map(result => {
            return DieACChallenge.getResultLabel(result.result);
        });
    }

    static getValue(dieSide) {
        // 1 if Effect, otherwise take the value
        return typeof DieACChallenge.values[dieSide] === 'string'
            ? 1
            : DieACChallenge.values[dieSide];
    }
}

