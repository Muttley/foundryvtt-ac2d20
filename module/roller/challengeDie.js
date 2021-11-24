export default class DieACChallenge extends Die {
    constructor(termData) {
        termData.faces = 6;
        super(termData);

    }

    static DENOMINATION = 'p';

    /** @override */
    getResultLabel(result) {
        return {
            "1": '<img src="systems/ac2d20/assets/dice/d1.webp" />',
            "2": '<img src="systems/ac2d20/assets/dice/d2.webp" />',
            "3": '<img src="systems/ac2d20/assets/dice/d3.webp" />',
            "4": '<img src="systems/ac2d20/assets/dice/d4.webp" />',
            "5": '<img src="systems/ac2d20/assets/dice/d5.webp" />',
            "6": '<img src="systems/ac2d20/assets/dice/d6.webp" />'
        }[result.result];
    }


}

