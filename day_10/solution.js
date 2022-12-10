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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 13140 : 'MCD'}`);
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
    class Operation {
        constructor({ cycleDuration }) {
            this.cycleDuration = cycleDuration;
        }

        affectRegister(x) { return x;}
    }
    class AddValueOperation extends Operation {
        constructor({ value }) {
            super({ cycleDuration: 2 });
            this.value = value;
        }

        affectRegister(x) {
            return x + this.value;
        }
    }
    class NoopOperation extends Operation {
        constructor() {
            super({ cycleDuration: 1 });
        }

        affectRegister(x) {
            return super.affectRegister(x);
        }
    }
    class CPU {
        constructor() {
            this.xRegister = 1;
            this.currentCycle = 1;
            this.registerByEndCyle = {
                1: 1,
            };
        }

        doOperation(operation) {
            for(let i = 1; i < operation.cycleDuration; ++i) {
                this.currentCycle = this.currentCycle + 1;
                this.registerByEndCyle[this.currentCycle] = this.xRegister;
            }
            this.currentCycle = this.currentCycle + 1;
            this.xRegister = operation.affectRegister(this.xRegister);
            this.registerByEndCyle[this.currentCycle] = this.xRegister;
        }

        getRegisterValueAtEndCycleNth(cycleNumber) {
            return this.registerByEndCyle[cycleNumber];
        }

        solve() {
            const maxCycle = _.max(Object.keys(this.registerByEndCyle).map(_.toNumber));
            const registerAt20thCycle = this.getRegisterValueAtEndCycleNth(20);
            let answer = registerAt20thCycle * 20;
            for(let i = 60; i <= maxCycle; i += 40) {
                let registerAtNth = this.getRegisterValueAtEndCycleNth(i);
                answer = answer + (i*registerAtNth);
            }
            return answer;
        }

    }
    const myCpu = new CPU();
    for(const line of input.split('\n')) {
        if(line.length === 0) break;
        let operation;
        if(line.startsWith('noop')) operation = new NoopOperation();
        else {
            const [,valueStr] = line.split(' ');
            operation = new AddValueOperation({ value: _.toNumber(valueStr) });
        }
        myCpu.doOperation(operation);
    }

    return myCpu.solve();
}

function solve2(input) {
    class Operation {
        constructor({ cycleDuration }) {
            this.cycleDuration = cycleDuration;
        }

        affectRegister(x) { return x;}
    }
    class AddValueOperation extends Operation {
        constructor({ value }) {
            super({ cycleDuration: 2 });
            this.value = value;
        }

        affectRegister(x) {
            return x + this.value;
        }
    }
    class NoopOperation extends Operation {
        constructor() {
            super({ cycleDuration: 1 });
        }

        affectRegister(x) {
            return super.affectRegister(x);
        }
    }
    class CPU {
        constructor() {
            this.xRegister = 1;
            this.currentCycle = 1;
            this.registerByEndCyle = {
                0: 1,
                1: 1,
            };
        }

        doOperation(operation) {
            for(let i = 1; i < operation.cycleDuration; ++i) {
                this.currentCycle = this.currentCycle + 1;
                this.registerByEndCyle[this.currentCycle] = this.xRegister;
            }
            this.currentCycle = this.currentCycle + 1;
            this.xRegister = operation.affectRegister(this.xRegister);
            this.registerByEndCyle[this.currentCycle] = this.xRegister;
        }

        getRegisterValueAtEndCycleNth(cycleNumber) {
            return this.registerByEndCyle[cycleNumber];
        }

    }
    const myCpu = new CPU();
    for(const line of input.split('\n')) {
        if(line.length === 0) break;
        let operation;
        if(line.startsWith('noop')) operation = new NoopOperation();
        else {
            const [,valueStr] = line.split(' ');
            operation = new AddValueOperation({ value: _.toNumber(valueStr) });
        }
        myCpu.doOperation(operation);
    }

    const CRTPrint = [];
    for(let i = 0; i < 240; ++i) {
        const pixelPos = i%40;
        if(i !==0 && pixelPos === 0) CRTPrint.push('\n');
        const cycle = i + 1;
        const registerValue = myCpu.getRegisterValueAtEndCycleNth(cycle);
        if(registerValue === pixelPos || (registerValue - 1) === pixelPos || (registerValue + 1) === pixelPos) CRTPrint.push('#');
        else CRTPrint.push('.');
    }
    console.log(CRTPrint.join(''));
    return 'OK';
}
