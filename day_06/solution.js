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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 10 : 29}`);
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
    const sequence = [input[0], input[1], input[2], input[3]];
    let i = 4;
    const isSequenceUniq = (sequence) => _.uniq(sequence).length === sequence.length;
    for(i; i < input.length; ++i) {
          sequence.shift();
          sequence.push(input[i]);
          if(isSequenceUniq(sequence)) break;
    }
    return i+1;
}

function solve2(input) {
    const sequence = [input[0], input[1], input[2], input[3], input[4], input[5], input[6], input[7], input[8], input[9], input[10], input[11], input[12], input[13]];
    let i = 14;
    const isSequenceUniq = (sequence) => _.uniq(sequence).length === sequence.length;
    for(i; i < input.length; ++i) {
        sequence.shift();
        sequence.push(input[i]);
        if(isSequenceUniq(sequence)) break;
    }
    return i+1;
}
