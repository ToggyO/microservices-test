import path from 'path';
import { format } from 'winston';
import chalk from 'chalk';
import notifier from 'node-notifier';

export default class LocalStrategy {
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

    this.#logMethodsFabric(this.#levels);
    // Create stream method
    this.stream = {
      write: (message) => this.warn(message),
    };
  }

	#levels = {};

	#colors = {};

	#catalogName = 'log';

	/**
   * Notification to local dev machine
   * @param {string} name
   * @param {string} version
   * @param {string} level
   * @param {string} message
   * @private
   */
	#notify = ({
	  name,
	  version,
	  level,
	  message,
	} = {}) => {
	  const options = {
	    sound: true,
	    wait: true,
	    // Choose your icon
	    icon: path.join(__dirname, '../deprecation.png'),
	  };

	  notifier.notify({
	    title: `${name} v.${version} got ${level} message`,
	    message,
	    ...options,
	  });
	};

	/**
   * Custom format for Winston
   * @returns {never}
   * @private
   */
  #transportFormatterCustom = () => format((info, options) => this.#transportDataFormatter(info, options));

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
	    this[level] = (message, options = {}) => {
	      if (typeof message !== 'string') return;
	      const { color = this.#colors[level] } = options;
	      const coloredOutput = chalk.keyword(color);
	      const { name = 'server', version = 'unknown' } = this._app;
	      const logMessage = (() => {
	        let msg;
	        try {
	          // FIXME: add second arg { type: 'console' }
	          msg = JSON.stringify(customConsole.transform({ level, message }));
	        } catch (error) {
	          msg = '';
	        }
	        return msg;
	      })();

	      this.#notify({
	        name,
	        version,
	        level,
	        message,
	      });

	      if (level !== 'error') {
	        console.log(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
	      } else {
	        console.error(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
	      }
	    };
	  });
	};
}
