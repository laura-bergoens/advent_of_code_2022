const EASY_INPUT = `${__dirname}/easy_input.txt`;
const REAL_INPUT = `${__dirname}/real_input.txt`;
const fs = require('fs');
const _ = require('lodash');
const DO_REAL = true;
const DO_FIRST = true;
function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
async function main() {
    try {
        const rawEasyInput = fs.readFileSync(EASY_INPUT, 'utf8');
        const rawRealInput = fs.readFileSync(REAL_INPUT, 'utf8');
        const easySolution = DO_FIRST ? await solve1(rawEasyInput) : solve2(rawEasyInput);
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 31 : 'MCD'}`);
        if(DO_REAL) {
             const realSolution = DO_FIRST ? await solve1(rawRealInput) : solve2(rawRealInput);
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

/*
0;0------>
|
|
|
*/
async function solve1(input) {
    class Cell {
        constructor(x, y, height) {
            this.x = x;
            this.y = y;
            this.height = height;
            this.comingFrom = {};
            this.costToGetThere = 10000;
        }

        get coordinates() { return `${this.x}:${this.y}`}

        canMoveTo(destCell) {
            return destCell.height <= this.height + 1;
        }

        outcomeFrom(fromCell) {
            return this.comingFrom?.[fromCell.coordinates] || null;
        }

        rememberOutcomeComingFrom(fromCell, hasResult) {
            this.comingFrom[fromCell.coordinates] = hasResult;
        }

        updateCost(cost) {
            this.costToGetThere = cost;
        }
    }
    class Grid {
        constructor(maxX, maxY) {
            this.rows = [];
            for(let i = 0; i < maxY; ++i) {
                this.rows[i] = _.times(maxX, _.constant(-1));
            }
            this.startingCell = null;
            this.goalCell = null;
        }

        addCell(x, y, letterHeight, isStart, isGoal) {
            const height = letterHeight.charCodeAt(0) - ('a'.charCodeAt(0) - 1);
            this.rows[y][x] = new Cell(x, y, height);
            if(isStart) {
                this.startingCell = this.rows[y][x];
            }
            if(isGoal) this.goalCell = this.rows[y][x];
        }

        getPossibleCellsFor(cell) {
            const currX = cell.x;
            const currY = cell.y;
            const maxX = this.rows[0].length;
            const maxY = this.rows.length - 1;
            const couldHaveLeftCell = currX !== 0;
            const couldHaveTopCell = currY !== 0;
            const couldHaveRightCell = currX !== maxX;
            const couldHaveBottomCell = currY !== maxY;
            const leftCell = couldHaveLeftCell ? this.rows[currY][currX-1] : null;
            const rightCell = couldHaveRightCell ? this.rows[currY][currX+1] : null;
            const topCell = couldHaveTopCell ? this.rows[currY-1][currX] : null;
            const bottomCell = couldHaveBottomCell ? this.rows[currY+1][currX] : null;
            return _.compact([leftCell, rightCell, topCell, bottomCell])
                .filter((destCell) => cell.canMoveTo(destCell));
        }
    }
    const lines = input.split('\n');
    lines.pop();
    const grid = new Grid(lines[0].length, lines.length);
    let currentY = 0;
    for(const line of lines) {
        const cells = _.toArray(line);
        let currentX = 0;
        for(const cell of cells) {
            let isStart = cell === 'S';
            let isGoal = cell === 'E';
            let letterHeight = isStart ? 'a' : isGoal ? 'z' : cell;
            grid.addCell(currentX, currentY, letterHeight, isStart, isGoal);
            ++currentX;
        }
        ++currentY;
    }

    class Step {
        constructor() {}

        goToGoal(grid, currentCell, fromCell, goalCell, alreadyVisitedCells, validResults) {
            //console.log(`I am ${currentCell.coordinates}`);
            const cost = alreadyVisitedCells.length;
            if(cost >= currentCell.costToGetThere) {

                return;
            }
            currentCell.updateCost(cost);
            //console.log(`I have visited : ${alreadyVisitedCells.map((cell) => cell.coordinates).join(' ')}`);
            if(currentCell.coordinates === goalCell.coordinates) {
                //console.log(`YES GOAL ! ${alreadyVisitedCells.length}`);
                validResults.push(alreadyVisitedCells.length);
                return;
            }
            const possibleCells = grid.getPossibleCellsFor(currentCell);
            const notYetVisitedCells = possibleCells.filter((cell) => !alreadyVisitedCells.includes(cell));
            if(notYetVisitedCells.length === 0) return;
            const nextAlreadyVisitedCells = [...alreadyVisitedCells, currentCell];
            for(const cellToVisit of notYetVisitedCells) {
                const nextStep = new Step();
                nextStep.goToGoal(grid, cellToVisit, fromCell, goalCell, nextAlreadyVisitedCells, validResults, deadCells);
            }
        }
    }
    const rootStep = new Step();
    let validResults = [];
    let deadCells = [];
    rootStep.goToGoal(grid, grid.startingCell, null, grid.goalCell, [], validResults, deadCells);
    return _.min(validResults);
}

function solve2(input) {
    return 'solve2';
}
