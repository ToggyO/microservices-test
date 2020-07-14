/**
 * Описание: Файл содержит функцию обертку для асинхронных express middleware
 */

/**
 * Обертка для асинхронных express middleware
 * При использовании этой обертки становится возможным отлов ошибок
 * внутри асинхронных middleware, которые будут в итоге отловлены глобальным
 * обработчиком ошибок
 * @property {function} fn
 * @returns {function}
 */
export const asyncWrapper = (fn) => (...args) => {
  const fnReturn = fn(...args);
  const next = args[args.length - 1];
  return Promise.resolve(fnReturn).catch(next);
};
