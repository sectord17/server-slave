module.exports = function(app) {
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (input) => {
        let args = input.split(' ');

        if (args.length < 1) {
            return;
        }
    });
};