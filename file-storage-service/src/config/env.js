/**
 * Описание: файл для импорта конфигурации приложения из .env.development файлов
 */
import allowedEnvList from '../../env_list';

const envVariables = Object.keys(process.env).reduce((accumulator, envName) => {
  if (allowedEnvList.includes(envName)) {
    accumulator[envName] = process.env[envName];
  }
  return accumulator;
}, {});

const resultEnvVariables = {
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
