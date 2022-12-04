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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 2 : 4}`);
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
    let countFullIncludes = 0;
    const generateFullAssignment = (start, end) => {
        const fullAssignment = [];
        for(let i = start; i <= end; ++i) {
            fullAssignment.push(i);
        }
        return fullAssignment;
    }
    for(const pairs of input.split('\n')) {
        if (pairs.length > 0) {
            const [assignments1, assignments2] = pairs.split(',');
            const fullAssignments = [];
            fullAssignments.push(generateFullAssignment(_.toNumber(assignments1.split('-')[0]), _.toNumber(assignments1.split('-')[1])));
            fullAssignments.push(generateFullAssignment(_.toNumber(assignments2.split('-')[0]), _.toNumber(assignments2.split('-')[1])));
            const sortedAssignemnts = _.sortBy(fullAssignments, 'length');
            const intersection = _.intersection(sortedAssignemnts[0], sortedAssignemnts[1]);
            if(intersection.length === sortedAssignemnts[0].length) countFullIncludes = countFullIncludes + 1;
        }
    }
    return countFullIncludes;
}

function solve2(input) {
    let countIncludes = 0;
    const generateFullAssignment = (start, end) => {
        const fullAssignment = [];
        for(let i = start; i <= end; ++i) {
            fullAssignment.push(i);
        }
        return fullAssignment;
    }
    for(const pairs of input.split('\n')) {
        if (pairs.length > 0) {
            const [assignments1, assignments2] = pairs.split(',');
            const fullAssignments = [];
            fullAssignments.push(generateFullAssignment(_.toNumber(assignments1.split('-')[0]), _.toNumber(assignments1.split('-')[1])));
            fullAssignments.push(generateFullAssignment(_.toNumber(assignments2.split('-')[0]), _.toNumber(assignments2.split('-')[1])));
            const intersection = _.intersection(fullAssignments[0], fullAssignments[1]);
            if(intersection.length > 0) countIncludes = countIncludes + 1;
        }
    }
    return countIncludes;
}
