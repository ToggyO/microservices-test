/**
 * Описание: Сетевой слой
 */
import axios from 'axios';

import config from '@config';
import { getProp } from '@utils/helpers';

let axiosClient = null;

class AxiosClient {
  #client = null;

  constructor(props = {}) {
    const { isProduction } = config;
    const defaultMaxRetryAttempts = !isProduction ? 0 : 3;
    const { app, maxRetryAttempts = defaultMaxRetryAttempts, delayRetryAttempts = 10 } = props;
    const localAxios = axios.create();

    this.log = getProp(app, 'log', { warn: this._warn });

    // Request interceptors
    localAxios.interceptors.request.use(reqConfig => {
      let cacheHeaders = {};
      reqConfig.maxContentLength = Infinity;
      reqConfig.maxBodyLength = Infinity;

      if (reqConfig.method.toLowerCase() === 'get') {
        cacheHeaders = {
          ...cacheHeaders,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        };
      }

      // хедеры запроса
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...cacheHeaders,
        ...(reqConfig.customHeaders || {}),
      };

      // TODO: добавить авторизационный токен при необходимости

      return {
        ...reqConfig,
        ...headers,
      };
    });

    // Response interceptor
    localAxios.interceptors.response.use(
      response => response,
      error => {
        const originalRequest = error.config;
        const errorData = error.response;
        const useCustomErrorMessageHandling = getProp(error, 'config.useCustomErrorMessageHandling');

        if (typeof useCustomErrorMessageHandling === 'function') {
          const errorMessage = useCustomErrorMessageHandling(error);
          this.log.warn(errorMessage);
        }

        if (typeof originalRequest._retryAttempts === 'number') {
          originalRequest._retryAttempts += 1;
        } else {
          originalRequest._retryAttempts = 0;
        }

        if (typeof originalRequest._retryAttempts !== 'number' || originalRequest._retryAttempts >= maxRetryAttempts) {
          return errorData;
        }

        return new Promise(resolve => {
          setTimeout(() => resolve(localAxios(originalRequest)), delayRetryAttempts * 1000);
        });
      },
    );

    this.#client = localAxios;
  }

  _warn(...props) { // eslint-disable-line
    console.warn(props);
  }

  getAxios() {
    return this.#client;
  }
}

/**
 * Инициализация клиента Axios
 * @param {object} props - свойства
 */
export function init(props) {
  axiosClient = new AxiosClient(props);
  return axiosClient;
}

/**
 * Функция возвращает инстанс Axios
 * @returns {object}
 */
export function getAxios() {
  if (axiosClient) {
    return axiosClient.getAxios();
  }
  return null;
}

/**
 * Функция возвращает axiosClient
 * @returns {object}
 */
export function getAxiosClient() {
  if (axiosClient) {
    return axiosClient;
  }
  return null;
}
