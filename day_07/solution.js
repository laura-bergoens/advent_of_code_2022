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
        console.log(`easy input : ${easySolution}, should be ${DO_FIRST ? 95437 : 24933642}`);
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
    class DirNode {
        constructor(name, parentNode) {
            this.nodes = [];
            this.parentNode = parentNode;
            this.name = name;
        }
        get isDir() { return true }
        get size() { return _.sumBy(this.nodes, 'size') }
        addNode(node) { this.nodes.push(node) }
        getNodeByName(name) { return this.nodes.find((node) => node.name === name) }
        solvePuzzle1(acc) {
            if(this.size <= 100000) {
                acc = acc + this.size;
            }
            for(const node of this.nodes) {
                if(node.isDir) {
                    acc = node.solvePuzzle1(acc);
                }
            }
            return acc;
        }
    }
    class FileNode {
        constructor(name, parentNode, size) {
            this.size = size;
            this.parentNode = parentNode;
            this.name = name;
        }
        get isDir() { return false }
    }
    const rootNode = new DirNode('/', null);
    let currentDirNode = rootNode;
    const lines = input.split('\n');
    for(let i = 1; i < lines.length; ++i) {
        let line = lines[i];
        if(line.startsWith('$')) {
            if(line.startsWith('$ ls')) {
                ++i;
                line = lines[i];
                while(!line.startsWith('$') && i < lines.length && line.length > 0) {
                    if(line.startsWith('dir')) {
                        const parts = line.split(' ');
                        const dirNode = new DirNode(parts[1], currentDirNode);
                        currentDirNode.addNode(dirNode);
                    } else {
                        const parts = line.split(' ');
                        const fileNode = new FileNode(parts[1], currentDirNode, _.toNumber(parts[0]));
                        currentDirNode.addNode(fileNode);
                    }
                    ++i;
                    line = lines[i];
                }
                --i;
            } else if (line.startsWith('$ cd')) {
                const regex_cd = /^\$ cd (.*)/;
                const [,dest] = regex_cd.exec(line);
                if(dest === '..') currentDirNode = currentDirNode.parentNode;
                else currentDirNode = currentDirNode.getNodeByName(dest);
            }
        }
    }
    return rootNode.solvePuzzle1(0);
}

function solve2(input) {
    class Node {
        constructor({ name, parentNode }) {
            this.nodes = [];
            this.name = name;
            this.parentNode = parentNode;
        }

        get isDir() { throw new Error(); }
        get isFile() { throw new Error(); }
        addDirNode(node) { throw new Error(); }
        addFileNode(node) { throw new Error(); }
        getNodeByName(name) { return this.nodes.find((node) => node.name === name) }
        solvePuzzle2(who, goal) {
            if(!this.isDir) return who;
            const mySubgoal = goal - this.size;
            if(((goal-this.size) < 0) && mySubgoal > who.subgoal) who = {
                name: this.name,
                size: this.size,
                subgoal: mySubgoal,
            };
            for(const node of this.nodes) {
                who = node.solvePuzzle2(who, goal);
            }
            return who;
        }
    }
    class DirNode extends Node {
        constructor({ name, parentNode }) {
            super({name, parentNode});
        }
        get isDir() { return true }
        get isFile() { return false }
        get size() { return _.sumBy(this.nodes, 'size') }
        addDirNode(nodeToAdd) {
            if(this.nodes.find((node) => node.isDir && node.name === nodeToAdd.name)) return;
            this.nodes.push(nodeToAdd);
        }
        addFileNode(nodeToAdd) {
            if(this.nodes.find((node) => node.isFile && node.name === nodeToAdd.name)) return;
            this.nodes.push(nodeToAdd);
        }
    }
    class FileNode extends Node {
        constructor({ name, parentNode, size }) {
            super({name, parentNode});
            this.size = size;
        }
        get isDir() { return false }
        get isFile() { return true }
    }
    const rootNode = new DirNode({ name: '/', parentNode: null });
    let currentDirNode = rootNode;
    const lines = input.split('\n');
    const allNodes = [];
    for(let i = 1; i < lines.length; ++i) {
        let line = lines[i];
        if(line.startsWith('$')) {
            if(line.startsWith('$ ls')) {
                ++i;
                line = lines[i];
                while(!line.startsWith('$') && i < lines.length && line.length > 0) {
                    if(line.startsWith('dir')) {
                        const parts = line.split(' ');
                        const dirNode = new DirNode({ name: parts[1], parentNode: currentDirNode });
                        currentDirNode.addDirNode(dirNode);
                        allNodes.push(dirNode);
                    } else {
                        const parts = line.split(' ');
                        const fileNode = new FileNode({ name: parts[1], parentNode: currentDirNode, size: _.toNumber(parts[0])});
                        currentDirNode.addFileNode(fileNode);
                        allNodes.push(fileNode);
                    }
                    ++i;
                    line = lines[i];
                }
                --i;
            } else if (line.startsWith('$ cd')) {
                const regex_cd = /^\$ cd (.*)/;
                const [,dest] = regex_cd.exec(line);
                if(dest === '..') currentDirNode = currentDirNode.parentNode;
                else currentDirNode = currentDirNode.getNodeByName(dest);
            }
        }
    }
    const availableSpace = 70000000 - rootNode.size;
    const spaceToFree = 30000000 - availableSpace;
    const who =  rootNode.solvePuzzle2({ name: 'NONE', size: 999999999999, subgoal: spaceToFree - 999999999999 }, spaceToFree);
    return who.size;
}
