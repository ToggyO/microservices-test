/**
 * Описание: Файл содержит функция получения базового URL микросериса
 */
import config from 'config';

const {
  isProduction,
  NGINX_HOST,
  NGINX_PORT,
  MIC_ACCOUNT_HOST,
  MIC_ACCOUNT_PORT,
  MIC_FILES_HOST,
  MIC_FILES_PORT,
  MIC_FILES_ROUTE_PREFIX,
} = config;

export const getAppBaseUrl = () => isProduction
  ? `http://${NGINX_HOST}${NGINX_PORT ? `:${NGINX_PORT}` : ''}`
  : `http://${MIC_ACCOUNT_HOST}:${MIC_ACCOUNT_PORT}`;

export const getFileServiceBaseUrl = () => isProduction
  ? `http://${NGINX_HOST}${NGINX_PORT ? `:${NGINX_PORT}` : ''}${MIC_FILES_ROUTE_PREFIX}`
  : `http://${MIC_FILES_HOST}:${MIC_FILES_PORT}${MIC_FILES_ROUTE_PREFIX}`;
