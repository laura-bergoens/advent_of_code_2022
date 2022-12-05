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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 'CMZ' : 'MCD'}`);
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
    const isCrateLine = (line) => line.includes('[');
    const isRoutineLine = (line) => line.includes('move');
    const nextIndex = (index) => index + 1;
    const nextCrate = (crateStr) => _.toString(_.toNumber(crateStr) + 1);
    const routines = [];
    const crateStacks = {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
    }
    for(const line of input.split('\n')) {
        if(isRoutineLine(line)) routines.push(line);
        if(isCrateLine(line)) {
            let currentCrate = '1';
            let currentIndex = 0;
            while(currentIndex < line.length) {
                if(currentIndex%4 === 0) {
                    if(line[currentIndex] === ' ') {
                        currentIndex = nextIndex(currentIndex);
                        currentIndex = nextIndex(currentIndex);
                        currentIndex = nextIndex(currentIndex);
                    } else {
                        currentIndex = nextIndex(currentIndex);
                        crateStacks[currentCrate].push(line[currentIndex]);
                        currentIndex = nextIndex(currentIndex);
                        currentIndex = nextIndex(currentIndex);
                    }
                } else if(currentIndex%4 === 3) {
                    if(line[currentIndex] === ' ') {
                        currentCrate = nextCrate(currentCrate);
                        currentIndex = nextIndex(currentIndex);
                    }
                }
            }
        }
    }
    crateStacks['1'] = _.reverse(crateStacks['1']);
    crateStacks['2'] = _.reverse(crateStacks['2']);
    crateStacks['3'] = _.reverse(crateStacks['3']);
    crateStacks['4'] = _.reverse(crateStacks['4']);
    crateStacks['5'] = _.reverse(crateStacks['5']);
    crateStacks['6'] = _.reverse(crateStacks['6']);
    crateStacks['7'] = _.reverse(crateStacks['7']);
    crateStacks['8'] = _.reverse(crateStacks['8']);
    crateStacks['9'] = _.reverse(crateStacks['9']);
    const getResult = (theCrateStacks) => {
        const result = [];
        result.push(theCrateStacks['1'].pop(),theCrateStacks['2'].pop(),theCrateStacks['3'].pop(),
            theCrateStacks['4'].pop(),theCrateStacks['5'].pop(),theCrateStacks['6'].pop(),
            theCrateStacks['7'].pop(),theCrateStacks['8'].pop(),theCrateStacks['9'].pop());
        return result.join('');
    }
    const regex_routine = /^move ([0-9]*) from ([0-9]*) to ([0-9]*)/;
    for(const routine of routines) {
        const result = regex_routine.exec(routine);
        const count = _.toNumber(result[1]);
        const fromStack = result[2];
        const toStack = result[3];
        for(let i = 0; i < count; ++i) {
            const crate = crateStacks[fromStack].pop();
            crateStacks[toStack].push(crate);
        }
    }
    return getResult(crateStacks);
}

function solve2(input) {
    const isCrateLine = (line) => line.includes('[');
    const isRoutineLine = (line) => line.includes('move');
    const nextIndex = (index) => index + 1;
    const nextCrate = (crateStr) => _.toString(_.toNumber(crateStr) + 1);
    const routines = [];
    const crateStacks = {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
    }
    for(const line of input.split('\n')) {
        if(isRoutineLine(line)) routines.push(line);
        if(isCrateLine(line)) {
            let currentCrate = '1';
            let currentIndex = 0;
            while(currentIndex < line.length) {
                if(currentIndex%4 === 0) {
                    if(line[currentIndex] === ' ') {
                        currentIndex = nextIndex(currentIndex);
                        currentIndex = nextIndex(currentIndex);
                        currentIndex = nextIndex(currentIndex);
                    } else {
                        currentIndex = nextIndex(currentIndex);
                        crateStacks[currentCrate].push(line[currentIndex]);
                        currentIndex = nextIndex(currentIndex);
                        currentIndex = nextIndex(currentIndex);
                    }
                } else if(currentIndex%4 === 3) {
                    if(line[currentIndex] === ' ') {
                        currentCrate = nextCrate(currentCrate);
                        currentIndex = nextIndex(currentIndex);
                    }
                }
            }
        }
    }
    crateStacks['1'] = _.reverse(crateStacks['1']);
    crateStacks['2'] = _.reverse(crateStacks['2']);
    crateStacks['3'] = _.reverse(crateStacks['3']);
    crateStacks['4'] = _.reverse(crateStacks['4']);
    crateStacks['5'] = _.reverse(crateStacks['5']);
    crateStacks['6'] = _.reverse(crateStacks['6']);
    crateStacks['7'] = _.reverse(crateStacks['7']);
    crateStacks['8'] = _.reverse(crateStacks['8']);
    crateStacks['9'] = _.reverse(crateStacks['9']);
    const getResult = (theCrateStacks) => {
        const result = [];
        result.push(theCrateStacks['1'].pop(),theCrateStacks['2'].pop(),theCrateStacks['3'].pop(),
            theCrateStacks['4'].pop(),theCrateStacks['5'].pop(),theCrateStacks['6'].pop(),
            theCrateStacks['7'].pop(),theCrateStacks['8'].pop(),theCrateStacks['9'].pop());
        return result.join('');
    }
    const regex_routine = /^move ([0-9]*) from ([0-9]*) to ([0-9]*)/;
    for(const routine of routines) {
        const result = regex_routine.exec(routine);
        const count = _.toNumber(result[1]);
        const fromStack = result[2];
        const toStack = result[3];
        let crates = [];
        for(let i = 0; i < count; ++i) {
            crates.push(crateStacks[fromStack].pop());
        }
        crates = _.reverse(crates);
        crateStacks[toStack].push(...crates);
    }
    return getResult(crateStacks);
}
