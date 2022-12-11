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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 10605 : 2713310158}`);
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
    class Monkey {
        constructor(number, startingItems, shouldMultiply, rawValue, divisibleBy, monkeyNumberIfTestTrue, monkeyNumberIfTestFalse) {
            this.number = number;
            this.items = [...startingItems];
            this.shouldMultiply = shouldMultiply;
            this.rawValue = rawValue;
            this.divisibleBy = divisibleBy;
            this.monkeyNumberIfTestTrue = monkeyNumberIfTestTrue;
            this.monkeyNumberIfTestFalse = monkeyNumberIfTestFalse;
            this.inspectionCount = 0;
        }

        addItems(items) {
            this.items.push(...items);
        }

        _inspect(item) {
            this.inspectionCount = this.inspectionCount + 1;
            let cloneItem = item;
            let value = this.rawValue === 'old' ? cloneItem : _.toNumber(this.rawValue);
            if(this.shouldMultiply) cloneItem = cloneItem * value;
            else cloneItem = cloneItem + value;
            return cloneItem;
        }

        _getBoredFor(item) {
            return _.floor(item/3);
        }

        _test(item) {
            if(item%this.divisibleBy === 0) return this.monkeyNumberIfTestTrue;
            return this.monkeyNumberIfTestFalse;
        }

        do() {
            const giveaway = {};
            console.log(`Monkey ${this.number} doing...`);
            while(this.items.length > 0) {
                let item = this.items.shift();
                console.log(`ITEM ${item}`);
                item = this._inspect(item);
                console.log(`after inspection -> ${item}`);
                item = this._getBoredFor(item);
                console.log(`after boredom -> ${item}`);
                const monkeyNumberToGiveItemTo = this._test(item);
                console.log(`should give to -> ${monkeyNumberToGiveItemTo}`);
                if(!giveaway[monkeyNumberToGiveItemTo]) giveaway[monkeyNumberToGiveItemTo] = [];
                giveaway[monkeyNumberToGiveItemTo].push(item);
            }
            console.log(`giveaway -> ${giveaway}`);
            return giveaway;
        }
    }
    const lines = input.split('\n');
    const monkeys = [];
    for(let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        if(line.startsWith('Monkey')) {
            const itemsLine = lines[++i];
            const operationLine = lines[++i];
            const testLine = lines[++i];
            const testTrueLine = lines[++i];
            const testFalseLine = lines[++i];
            const number = _.toNumber(line.split(' ')[1].slice(0, -1));
            const startingItems = itemsLine.split(': ')[1].split(', ').map(_.toNumber);
            const shouldMultiply = operationLine.trim().split(' ')[4] === '*';
            const rawValue = operationLine.trim().split(' ')[5];
            const divisibleBy = _.toNumber(testLine.split(': ')[1].split(' ')[2]);
            const monkeyNumberIfTestTrue = _.toNumber(testTrueLine.split(': ')[1].split(' ')[3]);
            const monkeyNumberIfTestFalse = _.toNumber(testFalseLine.split(': ')[1].split(' ')[3]);
            const monkey = new Monkey(number, startingItems, shouldMultiply, rawValue, divisibleBy, monkeyNumberIfTestTrue, monkeyNumberIfTestFalse);
            monkeys.push(monkey);
        }
    }
    const ROUNDS = 20;
    for(let round = 0; round < ROUNDS; ++round) {
        console.log('ROUND ', round);
        for(const monkey of monkeys) {
            const giveaway = monkey.do();
            for(const [monkeyNumber, items] of Object.entries(giveaway)) {
                monkeys[monkeyNumber].addItems(items);
            }
        }
    }
    const orderedMonkeys = _.reverse(_.sortBy(monkeys, 'inspectionCount'));
    return orderedMonkeys[0].inspectionCount * orderedMonkeys[1].inspectionCount;
}

function solve2(input) {
    class Monkey {
        constructor(number, startingItems, shouldMultiply, rawValue, divisibleBy, monkeyNumberIfTestTrue, monkeyNumberIfTestFalse) {
            this.number = number;
            this.items = [...startingItems];
            this.shouldMultiply = shouldMultiply;
            this.rawValue = rawValue;
            this.divisibleBy = divisibleBy;
            this.monkeyNumberIfTestTrue = monkeyNumberIfTestTrue;
            this.monkeyNumberIfTestFalse = monkeyNumberIfTestFalse;
            this.inspectionCount = 0;
        }

        addItems(items) {
            for(const item of items) {
                let cloneItem = (item % this.magicNumber) + this.magicNumber;
                this.items.push(cloneItem);
            }
        }

        _inspect(item) {
            this.inspectionCount = this.inspectionCount + 1;
            let cloneItem = item;
            let value = this.rawValue === 'old' ? cloneItem : _.toNumber(this.rawValue);
            if(this.shouldMultiply) cloneItem = cloneItem * value;
            else cloneItem = cloneItem + value;
            return cloneItem;
        }

        _getBoredFor(item) {
            return item;
        }

        _test(item) {
            if(item%this.divisibleBy === 0) return this.monkeyNumberIfTestTrue;
            return this.monkeyNumberIfTestFalse;
        }

        do() {
            const giveaway = {};
            //console.log(`Monkey ${this.number} doing...`);
            while(this.items.length > 0) {
                let item = this.items.shift();
                //console.log(`ITEM ${item}`);
                item = this._inspect(item);
                //console.log(`after inspection -> ${item}`);
                item = this._getBoredFor(item);
                //console.log(`after boredom -> ${item}`);
                const monkeyNumberToGiveItemTo = this._test(item);
                //console.log(`should give to -> ${monkeyNumberToGiveItemTo}`);
                if(!giveaway[monkeyNumberToGiveItemTo]) giveaway[monkeyNumberToGiveItemTo] = [];
                giveaway[monkeyNumberToGiveItemTo].push(item);
            }
            //console.log(`giveaway -> ${giveaway}`);
            return giveaway;
        }

        setMagicNumber(magicNumber) {
            this.magicNumber = magicNumber;
        }
    }
    const lines = input.split('\n');
    const monkeys = [];
    let magicNumber = null;
    for(let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        if(line.startsWith('Monkey')) {
            const itemsLine = lines[++i];
            const operationLine = lines[++i];
            const testLine = lines[++i];
            const testTrueLine = lines[++i];
            const testFalseLine = lines[++i];
            const number = _.toNumber(line.split(' ')[1].slice(0, -1));
            const startingItems = itemsLine.split(': ')[1].split(', ').map(_.toNumber);
            const shouldMultiply = operationLine.trim().split(' ')[4] === '*';
            const rawValue = operationLine.trim().split(' ')[5];
            const divisibleBy = _.toNumber(testLine.split(': ')[1].split(' ')[2]);
            magicNumber = magicNumber ? magicNumber * divisibleBy : divisibleBy;
            const monkeyNumberIfTestTrue = _.toNumber(testTrueLine.split(': ')[1].split(' ')[3]);
            const monkeyNumberIfTestFalse = _.toNumber(testFalseLine.split(': ')[1].split(' ')[3]);
            const monkey = new Monkey(number, startingItems, shouldMultiply, rawValue, divisibleBy, monkeyNumberIfTestTrue, monkeyNumberIfTestFalse);
            monkeys.push(monkey);
        }
    }
    _.each(monkeys, (monkey) => monkey.setMagicNumber(magicNumber));
    console.log('magicNumber ', magicNumber);
    const ROUNDS = 10000;
    for(let round = 0; round < ROUNDS; ++round) {
        for(const monkey of monkeys) {
            const giveaway = monkey.do();
            for(const [monkeyNumber, items] of Object.entries(giveaway)) {
                monkeys[monkeyNumber].addItems(items);
            }
        }
    }
    const orderedMonkeys = _.reverse(_.sortBy(monkeys, 'inspectionCount'));
    console.log(orderedMonkeys);
    return orderedMonkeys[0].inspectionCount * orderedMonkeys[1].inspectionCount;
}
