import chalk from 'chalk';

export class Logger {

    /**
     *
     * @param {Boolean} isVerbose True if verbose mode is enabled
     */
    constructor(isVerbose) {
        this.isVerbose = isVerbose;
    }

    log(message) {
        console.log(message)
    }

    info(message) {
        console.log(chalk.cyan(message));
    }

    /**
     * @description
     * Debug message only printed if verbose mode is enabled
     *
     * @param {String} message
     */
    debug(message) {
        if (this.isVerbose) {
            console.log(chalk.gray(message));
        }
    }

    warn(message) {
        console.log(chalk.yellow(message));
    }

    error(message) {
        console.log(chalk.red(message));
    }

    success(message) {
        console.log(chalk.green(message));
    }

}
