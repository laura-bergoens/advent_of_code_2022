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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 157 : 70}`);
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
    const computePriority = (letter) => {
        if(letter === letter.toLowerCase()) {
            return letter.charCodeAt(0) - ('a'.charCodeAt(0) - 1);
        }
        return letter.charCodeAt(0) - ('A'.charCodeAt(0) - 27);
    };
    const splitStringInHalvesAsArray = (string) => [_.toArray(string.slice(0, string.length / 2)), _.toArray(string.slice(string.length / 2, string.length))];
    let sumPriorities = 0;
    for(const backpack of input.split('\n')) {
    const [firstHalf, secondHalf] = splitStringInHalvesAsArray(backpack);
        const intersection = _.intersection(firstHalf, secondHalf);
        sumPriorities = sumPriorities + (intersection.length > 0 ? computePriority(intersection[0]) : 0);
    }
    return sumPriorities;
}

function solve2(input) {
    const computePriority = (letter) => {
        if(letter === letter.toLowerCase()) {
            return letter.charCodeAt(0) - ('a'.charCodeAt(0) - 1);
        }
        return letter.charCodeAt(0) - ('A'.charCodeAt(0) - 27);
    };
    let sumPriorities = 0;
    let backpack1 = [], backpack2 = [], backpack3 = [];
    for(const backpack of input.split('\n')) {
        backpack3 = backpack1.length > 0  && backpack2.length > 0 ? _.toArray(backpack) : backpack3;
        backpack2 = backpack1.length > 0 && backpack3.length === 0 ? _.toArray(backpack) : backpack2;
        backpack1 = backpack2.length === 0 && backpack3.length === 0 ? _.toArray(backpack) : backpack1;
        if(backpack3.length > 0) {
            const firstIntersection = _.intersection(backpack1, backpack2);
            const finalIntersection = _.intersection(firstIntersection, backpack3);
            sumPriorities = sumPriorities + (finalIntersection.length > 0 ? computePriority(finalIntersection[0]) : 0);
            backpack3 = [];
            backpack2 = [];
            backpack1 = [];
        }
    }
    return sumPriorities;
}
