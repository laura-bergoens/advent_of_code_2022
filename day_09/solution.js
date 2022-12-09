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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 13 : 1}`);
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
    class Coordinate {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }

        print() {
            return `(${this.x};${this.y})`;
        }

        isEqual(otherCoordinate) {
            return this.x === otherCoordinate.x && this.y === otherCoordinate.y;
        }

        copy() {
            return new Coordinate(this.x, this.y);
        }

        up(count) { this.y = this.y + count }

        right(count) { this.x = this.x + count }

        down(count) { this.y = this.y - count }

        left(count) { this.x = this.x - count }

        isAdjacent(otherCoordinate) {
            return this.isAdjacentTopSide(otherCoordinate)
                || this.isAdjacentRightSide(otherCoordinate)
                || this.isAdjacentBottomSide(otherCoordinate)
                || this.isAdjacentLeftSide(otherCoordinate)
        }

        isAdjacentTopSide(otherCoordinate) {
            const xOffset = this.x - otherCoordinate.x;
            return this.y === otherCoordinate.y - 1
                && (xOffset <= 1 && xOffset >= -1);
        }

        isAdjacentBottomSide(otherCoordinate) {
            const xOffset = this.x - otherCoordinate.x;
            return this.y === otherCoordinate.y + 1
                && (xOffset <= 1 && xOffset >= -1);
        }

        isAdjacentRightSide(otherCoordinate) {
            const yOffset = this.y - otherCoordinate.y;
            return this.x === otherCoordinate.x - 1
                && (yOffset <= 1 && yOffset >= -1);
        }

        isAdjacentLeftSide(otherCoordinate) {
            const yOffset = this.y - otherCoordinate.y;
            return this.x === otherCoordinate.x + 1
                && (yOffset <= 1 && yOffset >= -1);
        }

        isOnSameHorizontal(otherCoordinate) {
            return this.y === otherCoordinate.y;
        }

        isOnSameVertical(otherCoordinate) {
            return this.x === otherCoordinate.x;
        }

        isOneStepShiftedUpHorizontal(otherCoordinate) {
            return this.y === otherCoordinate.y - 1;
        }

        isOneStepShiftedDownHorizontal(otherCoordinate) {
            return this.y === otherCoordinate.y + 1;
        }

        isOneStepShiftedRightVertical(otherCoordinate) {
            return this.x === otherCoordinate.x - 1;
        }

        isOneStepShiftedLeftVertical(otherCoordinate) {
            return this.x === otherCoordinate.x + 1;
        }
    }
    class Knot {
        constructor(knotNumber, knotFollower) {
            this.currentCoordinate = new Coordinate(0,0);
            this.knotFollower = knotFollower || null;
            this.knotNumber = knotNumber;
            this.visitedCoordinates = [];
            this.updateVisitedCoordinates();
        }

        moveUp(update=true) {
            this.currentCoordinate.up(1);
            if(update)this.updateVisitedCoordinates();
            if(this.knotFollower) this.knotFollower.followKnot(this);
            console.log(this.print());
            console.log(this?.knotFollower?.print());
        }

        moveRight(update=true) {
            this.currentCoordinate.right(1);
            if(update)this.updateVisitedCoordinates();
            if(this.knotFollower) this.knotFollower.followKnot(this);
            console.log(this.print());
            console.log(this?.knotFollower?.print());
        }

        moveDown(update=true) {
            this.currentCoordinate.down(1);
            if(update)this.updateVisitedCoordinates();
            if(this.knotFollower) this.knotFollower.followKnot(this);
            console.log(this.print());
            console.log(this?.knotFollower?.print());
        }

        moveLeft(update=true) {
            this.currentCoordinate.left(1);
            if(update)this.updateVisitedCoordinates();
            if(this.knotFollower) this.knotFollower.followKnot(this);
            console.log(this.print());
            console.log(this?.knotFollower?.print());
        }

        print() {
            return `knot${this.knotNumber}: ${this.currentCoordinate.print()}`;
        }

        updateVisitedCoordinates() {
            if(!this.visitedCoordinates.find((coordinate) => coordinate.isEqual(this.currentCoordinate)))
                this.visitedCoordinates.push(this.currentCoordinate.copy());
        }

        followKnot(leaderKnot) {
            const leaderCoordinate = leaderKnot.currentCoordinate;
            if(this.currentCoordinate.isEqual(leaderCoordinate) || this.currentCoordinate.isAdjacent(leaderCoordinate)) return;
            if(this.currentCoordinate.isOnSameHorizontal(leaderCoordinate)) {
                if(leaderCoordinate.x > this.currentCoordinate.x) this.moveRight();
                else this.moveLeft();
                return;
            }
            if(this.currentCoordinate.isOnSameVertical(leaderCoordinate)){
                if(leaderCoordinate.y > this.currentCoordinate.y) this.moveUp();
                else this.moveDown();
                return;
            }
            if(this.currentCoordinate.isOneStepShiftedUpHorizontal(leaderCoordinate)) {
                this.moveUp(false);
                if(leaderCoordinate.x > this.currentCoordinate.x) this.moveRight();
                else this.moveLeft();
                return;
            }
            if(this.currentCoordinate.isOneStepShiftedDownHorizontal(leaderCoordinate)) {
                this.moveDown(false);
                if(leaderCoordinate.x > this.currentCoordinate.x) this.moveRight();
                else this.moveLeft();
                return;
            }
            if(this.currentCoordinate.isOneStepShiftedRightVertical(leaderCoordinate)) {
                this.moveRight(false);
                if(leaderCoordinate.y > this.currentCoordinate.y) this.moveUp();
                else this.moveDown();
                return;
            }
            if(this.currentCoordinate.isOneStepShiftedLeftVertical(leaderCoordinate)) {
                this.moveLeft(false);
                if(leaderCoordinate.y > this.currentCoordinate.y) this.moveUp();
                else this.moveDown();
                return;
            }
            throw new Error('this should not happen');
        }
    }
    const knot1 = new Knot(1, null);
    const headKnot = new Knot(0, knot1);
    for(const line of input.split('\n')) {
        if(line.length === 0) break;
        const [direction, count] = line.split(' ');
        if(direction === 'U') {
            console.log(`MOVE ${count} UP`);
            for(let i = 0; i < _.toNumber(count); ++i) {
                headKnot.moveUp();
                console.log('\tDONE');
            }
        }
        if(direction === 'R') {
            console.log(`MOVE ${count} RIGHT`);
            for(let i = 0; i < _.toNumber(count); ++i) {
                headKnot.moveRight();
                console.log('\tDONE');
            }
        }
        if(direction === 'D') {
            console.log(`MOVE ${count} DOWN`);
            for(let i = 0; i < _.toNumber(count); ++i) {
                headKnot.moveDown();
                console.log('\tDONE');
            }
        }
        if(direction === 'L') {
            console.log(`MOVE ${count} LEFT`);
            for(let i = 0; i < _.toNumber(count); ++i) {
                headKnot.moveLeft();
                console.log('\tDONE');
            }
        }
    }

    return knot1.visitedCoordinates.length;
}

function solve2(input) {
    class Coordinate {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }

        print() {
            return `(${this.x};${this.y})`;
        }

        isEqual(otherCoordinate) {
            return this.x === otherCoordinate.x && this.y === otherCoordinate.y;
        }

        copy() {
            return new Coordinate(this.x, this.y);
        }

        up(count) { this.y = this.y + count }

        right(count) { this.x = this.x + count }

        down(count) { this.y = this.y - count }

        left(count) { this.x = this.x - count }

        isAdjacent(otherCoordinate) {
            return this.isAdjacentTopSide(otherCoordinate)
                || this.isAdjacentRightSide(otherCoordinate)
                || this.isAdjacentBottomSide(otherCoordinate)
                || this.isAdjacentLeftSide(otherCoordinate)
        }

        isAdjacentTopSide(otherCoordinate) {
            const xOffset = this.x - otherCoordinate.x;
            return this.y === otherCoordinate.y - 1
                && (xOffset <= 1 && xOffset >= -1);
        }

        isAdjacentBottomSide(otherCoordinate) {
            const xOffset = this.x - otherCoordinate.x;
            return this.y === otherCoordinate.y + 1
                && (xOffset <= 1 && xOffset >= -1);
        }

        isAdjacentRightSide(otherCoordinate) {
            const yOffset = this.y - otherCoordinate.y;
            return this.x === otherCoordinate.x - 1
                && (yOffset <= 1 && yOffset >= -1);
        }

        isAdjacentLeftSide(otherCoordinate) {
            const yOffset = this.y - otherCoordinate.y;
            return this.x === otherCoordinate.x + 1
                && (yOffset <= 1 && yOffset >= -1);
        }

        isOnSameHorizontal(otherCoordinate) {
            return this.y === otherCoordinate.y;
        }

        isOnSameVertical(otherCoordinate) {
            return this.x === otherCoordinate.x;
        }

        isOneStepShiftedUpHorizontal(otherCoordinate) {
            //return this.y === otherCoordinate.y - 1;
            return this.y < otherCoordinate.y;
        }

        isOneStepShiftedDownHorizontal(otherCoordinate) {
            //return this.y === otherCoordinate.y + 1;
            return this.y > otherCoordinate.y;
        }

        isOneStepShiftedRightVertical(otherCoordinate) {
            //return this.x === otherCoordinate.x - 1;
            return this.x < otherCoordinate.x;
        }

        isOneStepShiftedLeftVertical(otherCoordinate) {
            //return this.x === otherCoordinate.x + 1;
            return this.x > otherCoordinate.x;
        }
    }
    class Knot {
        constructor(knotNumber, knotFollower) {
            this.currentCoordinate = new Coordinate(0,0);
            this.knotFollower = knotFollower || null;
            this.knotNumber = knotNumber;
            this.visitedCoordinates = [];
            this.updateVisitedCoordinates();
        }

        moveUp(finalMove=true) {
            this.currentCoordinate.up(1);
            if(finalMove){
                this.updateVisitedCoordinates();
                if(this.knotFollower) this.knotFollower.followKnot(this);
            }
        }

        moveRight(finalMove=true) {
            this.currentCoordinate.right(1);
            if(finalMove){
                this.updateVisitedCoordinates();
                if(this.knotFollower) this.knotFollower.followKnot(this);
            }
        }

        moveDown(finalMove=true) {
            this.currentCoordinate.down(1);
            if(finalMove){
                this.updateVisitedCoordinates();
                if(this.knotFollower) this.knotFollower.followKnot(this);
            }
        }

        moveLeft(finalMove=true) {
            this.currentCoordinate.left(1);
            if(finalMove){
                this.updateVisitedCoordinates();
                if(this.knotFollower) this.knotFollower.followKnot(this);
            }
        }

        print() {
            return `K-${this.knotNumber}: ${this.currentCoordinate.print()}\n${this?.knotFollower?.print()}`;
        }

        updateVisitedCoordinates() {
            if(!this.visitedCoordinates.find((coordinate) => coordinate.isEqual(this.currentCoordinate)))
                this.visitedCoordinates.push(this.currentCoordinate.copy());
        }

        followKnot(leaderKnot) {
            const leaderCoordinate = leaderKnot.currentCoordinate;
            if(this.currentCoordinate.isEqual(leaderCoordinate) || this.currentCoordinate.isAdjacent(leaderCoordinate)) return;
            if(this.currentCoordinate.isOnSameHorizontal(leaderCoordinate)) {
                if(leaderCoordinate.x > this.currentCoordinate.x) this.moveRight();
                else this.moveLeft();
                return;
            }
            if(this.currentCoordinate.isOnSameVertical(leaderCoordinate)){
                if(leaderCoordinate.y > this.currentCoordinate.y) this.moveUp();
                else this.moveDown();
                return;
            }
            if(this.currentCoordinate.isOneStepShiftedUpHorizontal(leaderCoordinate)) {
                this.moveUp(false);
                if(leaderCoordinate.x > this.currentCoordinate.x) this.moveRight();
                else this.moveLeft();
                return;
            }
            if(this.currentCoordinate.isOneStepShiftedDownHorizontal(leaderCoordinate)) {
                this.moveDown(false);
                if(leaderCoordinate.x > this.currentCoordinate.x) this.moveRight();
                else this.moveLeft();
                return;
            }
            if(this.currentCoordinate.isOneStepShiftedRightVertical(leaderCoordinate)) {
                this.moveRight(false);
                if(leaderCoordinate.y > this.currentCoordinate.y) this.moveUp();
                else this.moveDown();
                return;
            }
            if(this.currentCoordinate.isOneStepShiftedLeftVertical(leaderCoordinate)) {
                this.moveLeft(false);
                if(leaderCoordinate.y > this.currentCoordinate.y) this.moveUp();
                else this.moveDown();
                return;
            }
            console.log(`I am K-${this.knotNumber} : ${this.currentCoordinate.print()}`);
            console.log(`Leader : ${leaderCoordinate.print()}`);
            throw new Error('this should not happen');
        }
    }
    const knot9 = new Knot(9, null);
    const knot8 = new Knot(8, knot9);
    const knot7 = new Knot(7, knot8);
    const knot6 = new Knot(6, knot7);
    const knot5 = new Knot(5, knot6);
    const knot4 = new Knot(4, knot5);
    const knot3 = new Knot(3, knot4);
    const knot2 = new Knot(2, knot3);
    const knot1 = new Knot(1, knot2);
    const headKnot = new Knot(0, knot1);
    for(const line of input.split('\n')) {
        if(line.length === 0) break;
        const [direction, count] = line.split(' ');
        if(direction === 'U') {
            console.log(`MOVE ${count} UP`);
            for(let i = 0; i < _.toNumber(count); ++i) {
                headKnot.moveUp();
                console.log('\tDONE');
                console.log(headKnot.print());
            }
        }
        if(direction === 'R') {
            console.log(`MOVE ${count} RIGHT`);
            for(let i = 0; i < _.toNumber(count); ++i) {
                headKnot.moveRight();
                console.log('\tDONE');
                console.log(headKnot.print());
            }
        }
        if(direction === 'D') {
            console.log(`MOVE ${count} DOWN`);
            for(let i = 0; i < _.toNumber(count); ++i) {
                headKnot.moveDown();
                console.log('\tDONE');
                console.log(headKnot.print());
            }
        }
        if(direction === 'L') {
            console.log(`MOVE ${count} LEFT`);
            for(let i = 0; i < _.toNumber(count); ++i) {
                headKnot.moveLeft();
                console.log('\tDONE');
                console.log(headKnot.print());
            }
        }
    }

    return knot9.visitedCoordinates.length;
}
