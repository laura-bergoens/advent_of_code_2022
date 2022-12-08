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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 21 : 8}`);
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
    class Tree {
        constructor(x,y,value) {
            this.x = x;
            this.y = y;
            this.value = value;
        }
        get identity() { return `${this.x}-${this.y}`; }
        copy() {
            return new Tree(this.x, this.y, this.value);
        }
    }
    class Land {
        constructor() {
            this.rows = [];
        }

        addRow(row) {
            this.rows.push(row);
        }
        solve() {
            // scan by rows
            const visibleTrees = [];
            for(const row of this.rows) {
                const inverseRow = this.getInverseRow(row);
                visibleTrees.push(...this.findVisibleTreesInRow(row));
                visibleTrees.push(...this.findVisibleTreesInRow(inverseRow));
            }
            const columnLength = this.rows[0].length;
            for(let i = 0; i < columnLength; ++i) {
                const column = this.getColumn(i);
                const inverseColumn = this.getInverseRow(column);
                visibleTrees.push(...this.findVisibleTreesInRow(column));
                visibleTrees.push(...this.findVisibleTreesInRow(inverseColumn));

            }
            return _.uniqBy(visibleTrees,'identity').length;
        }
        findVisibleTreesInRow(row) {
            const visibleTrees = [];
            visibleTrees.push(row[0].copy());
            let currentHighestTreeValue = row[0].value;
            for(const tree of row) {
                if(tree.value > currentHighestTreeValue) {
                    visibleTrees.push(tree.copy());
                    currentHighestTreeValue = tree.value;
                }
            }
            return visibleTrees;
        }
        getColumn(columnIndex) {
            const column = [];
            for(const row of this.rows) {
                column.push(row[columnIndex].copy());
            }
            return column;
        }
        getInverseRow(row) {
            const inverseRow = [];
            for(const tree of row) {
                inverseRow.push(tree.copy());
            }
            return _.reverse(inverseRow);
        }
    }
    const myLand = new Land();
    const lines = input.split('\n');
    for(let y = 0; y < lines.length; ++y) {
        const line = lines[y];
        if(line.length === 0) break;
        const row = _.toArray(line);
        const trees = [];
        for(let x = 0; x < row.length; ++x) {
            trees.push(new Tree(x,y,row[x]));
        }
        myLand.addRow(trees);
    }
    return myLand.solve();
}

function solve2(input) {
    class Tree {
        constructor(x,y,value) {
            this.x = x;
            this.y = y;
            this.value = value;
        }
        get identity() { return `${this.x}-${this.y}`; }
        copy() {
            return new Tree(this.x, this.y, this.value);
        }
    }
    class Land {
        constructor() {
            this.rows = [];
        }

        addRow(row) {
            this.rows.push(row);
        }
        solve() {
            let highestScenicScore = 0;
            for(const row of this.rows) {
                for(const tree of row) {
                    const scenicScore = this.computeScenicScore(tree);
                    if(highestScenicScore<scenicScore)highestScenicScore=scenicScore;
                }
            }
            return highestScenicScore;
        }
        computeScenicScore(tree) {
            const maxX = this.rows[0].length - 1;
            const maxY = this.rows.length - 1;
            if(tree.x === 0 || tree.x === maxX || tree.y === 0 || tree.y === maxY) return 0;
            const visibleTreesUp = this.lookUp(tree);
            const visibleTreesDown = this.lookDown(tree);
            const visibleTreesLeft = this.lookLeft(tree);
            const visibleTreesRight = this.lookRight(tree);
            return visibleTreesUp * visibleTreesDown * visibleTreesLeft * visibleTreesRight;
        }
        lookUp(tree) {
            let countVisible = 0;
            let startY = tree.y - 1, x = tree.x;
            for(startY; startY >= 0; --startY) {
                const currentTree = this.rows[startY][x];
                countVisible = countVisible + 1;
                if(currentTree.value >= tree.value) break;
            }
            return countVisible;
        }
        lookDown(tree) {
            let countVisible = 0;
            const maxY = this.rows.length - 1;
            let startY = tree.y + 1, x = tree.x;
            for(startY; startY <= maxY; ++startY) {
                const currentTree = this.rows[startY][x];
                countVisible = countVisible + 1;
                if(currentTree.value >= tree.value) break;
            }
            return countVisible;
        }
        lookLeft(tree) {
            let countVisible = 0;
            let startX = tree.x - 1, y = tree.y;
            for(startX; startX >= 0; --startX) {
                const currentTree = this.rows[y][startX];
                countVisible = countVisible + 1;
                if(currentTree.value >= tree.value) break;
            }
            return countVisible;
        }
        lookRight(tree) {
            let countVisible = 0;
            const maxX = this.rows[0].length - 1;
            let startX = tree.x + 1, y = tree.y;
            for(startX; startX <= maxX; ++startX) {
                const currentTree = this.rows[y][startX];
                countVisible = countVisible + 1;
                if(currentTree.value >= tree.value) break;
            }
            return countVisible;
        }
    }
    const myLand = new Land();
    const lines = input.split('\n');
    for(let y = 0; y < lines.length; ++y) {
        const line = lines[y];
        if(line.length === 0) break;
        const row = _.toArray(line);
        const trees = [];
        for(let x = 0; x < row.length; ++x) {
            trees.push(new Tree(x,y,row[x]));
        }
        myLand.addRow(trees);
    }
    return myLand.solve();
}
