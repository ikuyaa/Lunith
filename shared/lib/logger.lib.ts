import winston from 'winston';

//The level types are in order of severity from highest to lowest

const {  timestamp, combine, colorize, printf} = winston.format;

const consoleTransport = new winston.transports.Console({
    format: combine(
        colorize({ all: false }),
    ),
});

const logLevels = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    colors: {
        emerg: 'bold red',
        alert: 'red',
        crit: 'magenta',
        error: 'red',
        warning: 'yellow',
        notice: 'cyan',
        info: 'green',
        debug: 'blue',
        timestamp: 'underline cyan',
        file: 'blue',
    }
}

winston.addColors(logLevels.colors);

const logFormat = combine(
    timestamp({ format: 'MM/DD/YYYY HH:mm:ss A' }),
    printf(({ timestamp, level, message, stack }) => {
        const colorizer = colorize();
        const coloredLevel = colorizer.colorize(level, level.toUpperCase());
        const coloredTimestamp = colorizer.colorize('timestamp', timestamp as string);
        const baseLog = `[${coloredTimestamp}] [${coloredLevel}] ${message}`; 
        
        return stack
        ? `${baseLog}\n${stack}`
        : `${baseLog}`;
    })
)

type LogToFiles = 'true' | 'false' | undefined ;

const fileTransport = (logToFiles: LogToFiles) => {
    if(!logToFiles || logToFiles === 'false')
        return [];

    return[
        new winston.transports.File({
            filename: 'logs/bot.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'logs/errors.log',
            level: 'error'
        })  
    ]
}

export function createLogger(logToFiles: LogToFiles) {
    const logger = winston.createLogger({
        levels: logLevels.levels,
        level: process.env.LOG_LEVEL as string || 'info',
        defaultMeta: { service: 'discord-bot' },
        format: logFormat,
        transports: [
            consoleTransport,
            ...fileTransport(logToFiles),
        ],
        exceptionHandlers: [
            consoleTransport
        ],
        exitOnError: false,
    });

    return logger;
}

export class Log {
    private static logger = createLogger(process.env.ENABLE_FILE_LOGGING || false);

    /**
     * @static
     * @param {string} message
     * @param {Error} [error]
     * @memberof Log
     */
    public static info(message: string, error?: Error) {    
        this.logger.info(message, error);
    }

    
    /**
     * @static
     * @param {string} message
     * @param {Error} [error]
     * @memberof Log
     */
    public static error(message: string, error?: Error) {
        this.logger.error(message, error);
    }


        
    /**
     * @static
     * @param {string} message
     * @param {Error} [error]
     * @memberof Log
     */
    public static emerg(message: string, error?: Error) {   
        this.logger.emerg(message, error);
    }

    
    /**
     * @static
     * @param {string} message
     * @param {Error} [error]
     * @memberof Log
     */
    public static alert(message: string, error?: Error) {    
        this.logger.alert(message, error);
    }

    /**
     * @static
     * @param {string} message
     * @param {Error} [error]
     * @memberof Log
     */
    public static crit(message: string, error?: Error) {    
        this.logger.crit(message, error);
    }

    /**
     * @static
     * @param {string} message
     * @param {Error} [error]
     * @memberof Log
     */ 
    public static warning(message: string, error?: Error) {    
        this.logger.warning(message, error);
    }

    /**
     * @static
     * @param {string} message
     * @param {Error} [error]
     * @memberof Log
     */
    public static notice(message: string, error?: Error) {    
        this.logger.notice(message, error);
    }

    /**
     * @static
     * @param message 
     * @param error 
     * @memberof Log
     */
    public static debug(message: string, error?: Error) {    
        this.logger.debug(message, error);
    }
}
