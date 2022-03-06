const { isNumeric } = require("mathjs");
const math = require("mathjs");

class DiceRoller {
    constructor() {
        this.result = 0;
        this.advantageModifier = "";
    }

    roll(diceArray) {
        let mathEquation = "";

        let outputStringArray = [];

        let die = {};

        this.advantageModifier = ["adv", "dis"].includes(diceArray[diceArray.length - 1]) ? diceArray.pop() : "";

        for (let dice of diceArray) {
            if (dice === "+" || dice === "-") {
                mathEquation += dice;
                outputStringArray.push(dice);
                continue;
            }

            let dieRollResult = 0;

            if (!isNaN(dice)) {
                dieRollResult = dice;

                mathEquation += dieRollResult;

                outputStringArray.push(dice);
            } else {
                die = this.parseDice(dice);

                dieRollResult = this.rollDice(die.parsed.sides, die.parsed.amount, die.parsed.dir, die.parsed.keep);

                mathEquation += dieRollResult.sum;

                let dieRollResultString = "";

                if (die.parsed.keep < die.parsed.amount) {
                    let keptRolls = dieRollResult.rolls.slice(0, die.parsed.keep);

                    let keptRollsSum = keptRolls.reduce((a, b) => parseInt(a) + parseInt(b), 0);
                    
                    for (let i = 0; i < keptRolls.length; i++) {
                        keptRolls[i] = "**" + keptRolls[i] + "**";
                    }

                    for (let i = 0; i < (dieRollResult.rolls.length - die.parsed.keep); i++) {
                        keptRolls.push("~~" + dieRollResult.rolls[parseInt(die.parsed.keep) + i] + "~~");
                    }

                    dieRollResult.rolls = keptRolls;
                    dieRollResultString = keptRollsSum + ") (" + dieRollResult.rolls.join(", ");
                } else {
                    dieRollResultString = dieRollResult.rolls.reduce((a, b) => parseInt(a) + parseInt(b), 0) + ") (" + dieRollResult.rolls.join(", ");
                }

                outputStringArray.push(dice + " (" + dieRollResultString + ")");
            }
        }

        return {
            output: outputStringArray.join(" "),
            result: math.evaluate(mathEquation)
        };
    }

    parseDice(dice) {
        let { groups: { count, sides, dir, keep } } = /(?<count>\d+)?d(?<sides>\d+)(k(?<dir>[hl])(?<keep>\d+))?/.exec(dice);

        if (!count) {
            count = 1;
        }

        if (this.advantageModifier !== "") {
            if (sides == 20 && count == 1) {
                count = "2";
                keep = "1";
                
                if (this.advantageModifier === "adv") {
                    dir = "h";
                } else {
                    dir = "l";
                }

                this.advantageModifier = "";
            }
        }

        if (!keep) {
            keep = count;
        }

        return {
            raw: dice,
            parsed: {
                sides: parseInt(sides),
                amount: parseInt(count),
                dir: dir,
                keep: parseInt(keep)
            }
        };
    }

    rollDice(sides, amount, direction, keep) {
        let dieRollResults = [];

        let die = new Die(sides);

        let dieRoll = "";

        if (amount > 100) {
            amount = 100;
        }

        for (let i = 0; i < amount; i++) {
            dieRoll = die.roll();
            dieRollResults.push(dieRoll);
        }

        if (direction === "l") {
            dieRollResults.sort((a, b) => a - b);
        } else if(direction === "h") {
            dieRollResults.sort((a, b) => b - a);
        }

        return {
            sum: dieRollResults.slice(0, keep).reduce((a, b) => a + b, 0),
            rolls: dieRollResults
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

module.exports = DiceRoller;