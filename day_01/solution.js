const EASY_INPUT = `${__dirname}/easy_input.txt`;
const REAL_INPUT = `${__dirname}/real_input.txt`;
const fs = require('fs');
const _ = require('lodash');
const DO_REAL = true;
const DO_FIRST = false;

async function main() {
    try {
        const rawEasyInput = fs.readFileSync(EASY_INPUT, 'utf8');
        const rawRealInput = fs.readFileSync(REAL_INPUT, 'utf8');
        const easySolution = DO_FIRST ? solve1(rawEasyInput) : solve2(rawEasyInput);
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 24000 : 45000}`);
        if(DO_REAL) {
             const realSolution = DO_FIRST ? solve1(rawRealInput) : solve2(rawRealInput);
             console.log(`real input : ${realSolution}`);
        }
    } catch (error) {
        console.error('\n', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main().then(
        () => process.exit(0),
        (err) => {
            console.error(err);
            process.exit(1);
        },
    );
}

function solve1(input) {
    let currentNumberAsStr = '', previousCharWasCarriageReturn = false, maxCumulatedCalories = 0, currentCumulatedCalories = 0;
    for(const char of input) {
        if(char === '\n') {
            if(previousCharWasCarriageReturn) {
                maxCumulatedCalories = currentCumulatedCalories > maxCumulatedCalories ? currentCumulatedCalories : maxCumulatedCalories;
                currentCumulatedCalories = 0;
                previousCharWasCarriageReturn = false;
            } else {
                currentCumulatedCalories = currentCumulatedCalories + _.toNumber(currentNumberAsStr);
                currentNumberAsStr = '';
                previousCharWasCarriageReturn = true;
            }
        } else if(_.isNumber(_.toNumber(char))) {
            currentNumberAsStr = currentNumberAsStr + char;
            previousCharWasCarriageReturn = false;
        } else {
            previousCharWasCarriageReturn = false;
        }
    }
    return maxCumulatedCalories;
}

function solve2(input) {
    let currentNumberAsStr = '', previousCharWasCarriageReturn = false, currentCumulatedCalories = 0;
    let maxCumulatedCalories = [];
    for(const char of input) {
        if(char === '\n') {
            if(previousCharWasCarriageReturn) {
                if(maxCumulatedCalories.length < 3) {
                    maxCumulatedCalories.push(currentCumulatedCalories);
                    maxCumulatedCalories = _.sortBy(maxCumulatedCalories);
                }
                else {
                    if(maxCumulatedCalories[0] < currentCumulatedCalories) maxCumulatedCalories[0] = currentCumulatedCalories;
                    maxCumulatedCalories = _.sortBy(maxCumulatedCalories);
                }
                currentCumulatedCalories = 0;
                previousCharWasCarriageReturn = false;
            } else {
                currentCumulatedCalories = currentCumulatedCalories + _.toNumber(currentNumberAsStr);
                currentNumberAsStr = '';
                previousCharWasCarriageReturn = true;
            }
        } else if(_.isNumber(_.toNumber(char))) {
            currentNumberAsStr = currentNumberAsStr + char;
            previousCharWasCarriageReturn = false;
        } else {
            previousCharWasCarriageReturn = false;
        }
    }
    if(maxCumulatedCalories[0] < currentCumulatedCalories) maxCumulatedCalories[0] = currentCumulatedCalories;
    maxCumulatedCalories = _.sortBy(maxCumulatedCalories);
    return _.sum(maxCumulatedCalories);
}
