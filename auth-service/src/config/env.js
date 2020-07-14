/**
 * Описание: файл для импорта конфигурации приложения из .env файлов
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const { env } = process;

const dotenvDir = path.join(
  process.cwd(),
  // env.NODE_ENV === 'production' ? '.env' : '.env',
  env.NODE_ENV === 'production' ? '.env' : '.env.development',
);
const defaultEnvVariables = dotenv.parse(fs.readFileSync(dotenvDir));

const envVariables = Object.keys(process.env).reduce((accumulator, envName) => {
  if (Object.keys(defaultEnvVariables).includes(envName)) {
    accumulator[envName] = process.env[envName];
  }
  return accumulator;
}, {});

const resultEnvVariables = {
  ...defaultEnvVariables,
  ...envVariables,
};
const variablesForPrint = Object.keys(resultEnvVariables).reduce((accumulator, envName) => {
  const MAX_LENGTH = 80;
  const vars = resultEnvVariables;
  const variableIsNotEmpty = typeof vars[envName] === 'string' && vars[envName].length > 0;
  const useCutting = variableIsNotEmpty && vars[envName].length > MAX_LENGTH;
  const variable = useCutting ? `${vars[envName].substr(0, MAX_LENGTH)}...` : vars[envName];
  return {
    ...accumulator,
    [envName]: variable,
  };
}, {});

console.table(variablesForPrint);
export default resultEnvVariables;
