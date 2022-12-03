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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 15 : 12}`);
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
    const points = {
        LOSE: 0,
        DRAW: 3,
        WIN: 6,
        ROCK: 1,
        PAPER: 2,
        SCISSORS: 3,
    };
    const scoreByFights = {
        'A X' : points.DRAW + points.ROCK,
        'A Y' : points.WIN + points.PAPER,
        'A Z' : points.LOSE + points.SCISSORS,
        'B X' : points.LOSE + points.ROCK,
        'B Y' : points.DRAW + points.PAPER,
        'B Z' : points.WIN + points.SCISSORS,
        'C X' : points.WIN + points.ROCK,
        'C Y' : points.LOSE + points.PAPER,
        'C Z' : points.DRAW + points.SCISSORS,
    };
    let totalScore = 0;
    for(const fight of input.split('\n')) {
        totalScore = totalScore + (scoreByFights?.[fight] || 0);
    }
    return totalScore;
}

function solve2(input) {
    const points = {
        LOSE: 0,
        DRAW: 3,
        WIN: 6,
        ROCK: 1,
        PAPER: 2,
        SCISSORS: 3,
    };
    const replacementMap = {
        'A X' : 'A Z',
        'A Y' : 'A X',
        'A Z' : 'A Y',
        'B X' : 'B X',
        'B Y' : 'B Y',
        'B Z' : 'B Z',
        'C X' : 'C Y',
        'C Y' : 'C Z',
        'C Z' : 'C X',
    };
    let newInput = '';
    for(const fight of input.split('\n')) {
        newInput = newInput + (replacementMap?.[fight] || '') + '\n';
    }
    return solve1(newInput);
}
