const EASY_INPUT = `${__dirname}/easy_input.txt`;
const REAL_INPUT = `${__dirname}/real_input.txt`;
const fs = require('fs');
const _ = require('lodash');
const DO_REAL = true;
const DO_FIRST = true;

async function main() {
    try {
        const rawEasyInput = fs.readFileSync(EASY_INPUT, 'utf8');
        const rawRealInput = fs.readFileSync(REAL_INPUT, 'utf8');
        const easySolution = DO_FIRST ? solve1(rawEasyInput) : solve2(rawEasyInput);
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 13 : 'MCD'}`);
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
    const lines = input.split('\n');
    lines.pop();
    const okPairIndices = [];
    let currentPairIndex = 1;
    for(let i = 0; i < lines.length; ++i) {
        if(lines[i].length > 0) {
            const firstPacketRaw = lines[i];
            const secondPacketRaw = lines[++i];
            const firstPacket = _parseLine(firstPacketRaw);
            const secondPacket = _parseLine(secondPacketRaw);
            const res = _compareArrays(firstPacket, secondPacket);
            if(res === 'ok') okPairIndices.push(currentPairIndex);
            ++currentPairIndex;
        }
    }

    console.log('result ', okPairIndices.join(', '));
    return _.sum(okPairIndices);
}

function _compareArrays(aLeft,aRight) {
    let i = 0;
    while(true) {
        let left = aLeft[i];
        let right = aRight[i];
        if(!left && right) return 'ok';
        if(left && !right) return 'ko';
        if(!left && !right) return 'idk';
        if(_.isNumber(left)) {
            if(_.isArray(right)) left = [left];
            if(left < right) return 'ok';
            else if (left > right) return 'ko';
        } else if (_.isArray(left)) {
            if(_.isNumber(right)) right = [right];
            const res = _compareArrays(left,right);
            if(res !== 'idk') return res;
        } else {
            throw new Error('wth');
        }
        ++i;
    }
}

function _parseLine(line) {
    let root = [];
    const characters = _.toArray(line);
    let currentCharacter = '';
    let currentIntegerAsStr = '';
    const listStack = [];
    for(let i = 0; i < characters.length; ++i) {
        currentCharacter = characters[i];
        if(currentCharacter === ',') {
            if(currentIntegerAsStr.length > 0) {
                listStack.at(-1).push(_.toNumber(currentIntegerAsStr));
                currentIntegerAsStr = '';
            }
        } else if(currentCharacter === '[') {
            if(listStack.length > 0) {
                const subList = [];
                listStack.at(-1).push(subList);
                listStack.push(subList);
            } else {
                listStack.push(root);
            }
        } else if(currentCharacter === ']') {
            if(currentIntegerAsStr.length > 0) {
                listStack.at(-1).push(_.toNumber(currentIntegerAsStr));
                currentIntegerAsStr = '';
            }
            listStack.pop();
        } else {
            currentIntegerAsStr = `${currentIntegerAsStr}${currentCharacter}`;
        }
    }
    return root;
}

function solve2(input) {
    return 'solve2';
}
