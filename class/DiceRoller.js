const math = require("mathjs");

class DiceRoller {
    constructor() {
        this.result = 0;
    }

    roll(diceArray) {
        let mathEquation = "";

        let outputStringArray = [];

        let die = {};

        for (let dice of diceArray) {
            if (dice === "+" || dice === "-") {
                mathEquation += dice;
                outputStringArray.push(dice);
                continue;
            }

            die = this.parseDice(dice);

            let dieRollResult = this.rollDice(die.parsed.sides, die.parsed.amount, die.parsed.keep);

            mathEquation += dieRollResult.sum;

            outputStringArray.push(dice + " (" + dieRollResult.rolls.join(", ") + ")");
        }

        return {
            output: outputStringArray.join(" "),
            result: math.evaluate(mathEquation)
        };
    }

    parseDice(dice) {
        let { groups: { count, sides, keep } } = /(?<count>\d+)d(?<sides>\d+)(k(?<keep>\d+))?/.exec(dice);

        if (!keep) {
            keep = count;
        }

        return {
            raw: dice,
            parsed: {
                sides: sides,
                amount: count,
                keep: keep
            }
        };
    }

    rollDice(sides, amount, keep) {
        let dieRollResults = [];

        let die = new Die(sides);

        for (let i = 0; i < amount; i++) {
            dieRollResults.push(die.roll());
        }

        dieRollResults.sort();

        return {
            sum: dieRollResults.reduce((a, b) => a + b, 0),
            rolls: dieRollResults.slice(0, keep)
        };
    }
}

class Die {
    constructor(sides) {
        sides *= 1;

        // No strange dice allowed here
        if (sides <= 0) {
            sides = 10;
        }

        // No crazy numbers
        if (sides > 1000) {
            sides = 1000;
        }

        this.sides = sides;
    }

    roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    }
}

module.exports = {
    DiceRoller
}