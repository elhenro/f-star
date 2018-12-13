class Consti {
    constructor(env = null) {
        this.GLOBAL = {
            environment: env,
        }
    }

    log(/**/) {
        let args = Array.prototype.slice.call(arguments);

        switch (this.GLOBAL.environment) {
            // Development
            case 'development':
            case 'dev':
                console.log(args);
                break;

            // Production/Live
            case 'production':
            case 'prod':
            case 'live':
                console.log(args);
                //todo: log to file
                break;

            // Fall back
            default:
                // todo: define default
                console.log('Logger fell back to default');
        }
    }

    error(/**/) {
        let args = Array.prototype.slice.call(arguments);

        switch (this.GLOBAL.environment) {
            // Development
            case 'development':
            case 'dev':
                console.error(args);
                break;

            // Production/Live
            case 'production':
            case 'prod':
            case 'live':
                console.error(args);
                //todo: log to file
                break;

            // Fall back
            default:
                // todo: define default
                console.error('Logger fell back to default');
        }
    }
    warn(/**/) {
        let args = Array.prototype.slice.call(arguments);

        switch (this.GLOBAL.environment) {
            // Development
            case 'development':
            case 'dev':
                console.warn(args);
                break;

            // Production/Live
            case 'production':
            case 'prod':
            case 'live':
                console.warn(args);
                //todo: log to file
                break;

            // Fall back
            default:
                // todo: define default
                console.warn('Logger fell back to default');
        }
    }
}