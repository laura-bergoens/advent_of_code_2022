const { readdirSync, copyFileSync, mkdirSync } = require('fs');
const _ = require('lodash');

async function main() {
    try {
        const directories = readdirSync(__dirname).filter((dir) => dir.startsWith('day')).sort();
        const latestDay = _.toNumber(directories.pop().split('_')[1]);
        const nextDay = latestDay + 1;
        const newDirPath = `${__dirname}/day_${nextDay < 10 ? `0${nextDay}` : nextDay }/`;
        mkdirSync(newDirPath);
        copyFileSync(`${__dirname}/templates/solution.js`, `${newDirPath}/solution.js`);
        copyFileSync(`${__dirname}/templates/easy_input.txt`, `${newDirPath}/easy_input.txt`);
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
