import path from 'path';
import fs from 'fs';
import { createLogger, transports, format } from 'winston';
import chalk from 'chalk';

const { combine, json, prettyPrint } = format;

export default class ProductionStrategy {
  constructor(props = {}) {
    this.#levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    this.#colors = {
      debug: 'orange',
      warn: 'yellow',
      info: 'green',
      error: 'red',
    };

    Object.keys(props).forEach((propName) => {
      this[`_${propName}`] = props[propName];
    });

    // ensure log directory exists
    const logDirectory = path.join(__dirname, `../../../../${this.#catalogName}`);
    // eslint-disable-next-line no-unused-expressions
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    this.#logMethodsFabric(this.#levels);
    // Create stream method
    this.stream = {
      write: (message) => this.warn(message),
    };
  }

	#levels;

	#colors;

	#catalogName = 'log';

	/**
   * Custom format for Winston
   * @returns {never}
   * @private
   */
  #transportFormatterCustom = () => format((info, options) => this.#transportDataFormatter(info, options));

	/**
   * Prepare Winston transport
   * @param {string} level
   * @returns {any[]}
   * @private
   */
	#transportCreator = ({ level } = {}) => {
	  const custom = this.#transportFormatterCustom();
	  const fileTransport = new transports.File({
	    level,
	    name: `file#${level}`,
	    filename: `${this.#catalogName}/${level}.log`,
	    maxsize: 10485760, // 10MB
	    maxFiles: 5,
	    format: combine(
	      custom({ type: 'file' }),
	      json(),
	      prettyPrint(),
	    ),
	  });

	  return [fileTransport];
	};

	/**
   * Prepare data log structure for Winston
   * @param {object} info
   * @para {object} options
   * @returns {string}
   * @private
   */
	#transportDataFormatter = (info = {}) => {
	  const { version } = this._app;
	  const now = new Date();
	  const accidentAt = now.toISOString();
	  const wasLaunchedAt = this.#getUpDate();

	  if (wasLaunchedAt) info.wasLaunchedAt = wasLaunchedAt;
	  if (accidentAt) info.accidentAt = accidentAt;
	  if (version) info.version = version;

	  return info;
	};

	/**
   *
   * @returns {string}
   * @private
   */
	#getUpDate = () => {
	  const now = Date.now();
	  const upTime = parseInt(process.uptime(), 10);
	  const upDateInMS = now - upTime;
	  const upDate = new Date(upDateInMS).toISOString();
	  return upDate;
	};

	/**
   * Create list of handlers for each log types
   * @param {object} levels
   * @private
   */
	#logMethodsFabric = (levels = {}) => {
	  const custom = this.#transportFormatterCustom();
	  const customConsole = custom({ type: 'console' });

	  Object.keys(levels).forEach((level) => {
	    this[`#${level}Logger`] = this.#loggerCreator(level);

	    this[level] = (message, options = {}) => {
	      if (typeof message !== 'string') return;
	      const { color = this.#colors[level] } = options;
	      const coloredOutput = chalk.keyword(color);
	      const logMessage = (() => {
	        let msg;
	        try {
	          msg = JSON.stringify(customConsole.transform({ level, message }));
	        } catch (error) {
	          msg = '';
	        }
	        return msg;
	      })();

	      this[`#${level}Logger`].log({ level, message });

	      if (level !== 'error') {
	        console.log(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
	      } else {
	        console.error(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
	      }
	    };
	  });
	};

	/**
   * Prepare Winston logger by a level
   * @param {string} level
   * @returns {object}
   * @private
   */
	#loggerCreator = (level) => {
	  const { name = 'server' } = this._app;
	  return createLogger({
	    level,
	    defaultMeta: { service: name },
	    transports: this.#transportCreator({ level }),
	    exitOnError: false,
	  });
	};
}
