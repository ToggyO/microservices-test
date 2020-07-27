/**
 * Описание: Вспомогательные функции
 */

/**
 * Проверка что значение не пустое
 * @param val - значение
 * @return {boolean}
 */
export function isEmpty(val) {
  return (val === undefined || val == null || val.length <= 0);
}

/**
 * Проверка, что объект пустой
 * @param {object} object
 * @return {boolean}
 */
export function isObjectEmpty(object) {
  for (let key in object) { // eslint-disable-line
    return false;
  }
  return true;
}

/**
 * Имплементация lodash.get функции
 * Позволяет безопасно извлечь свойство объекта
 * https://gist.github.com/harish2704/d0ee530e6ee75bad6fd30c98e5ad9dab
 * @param object - объект
 * @param keys - ключи по которым нужно достать свойство объекта
 * @param defaultVal - значение, возвращаемое по умолчанию
 * @returns {*}
 */
export function getProp(object = {}, keys, defaultVal) {
  keys = Array.isArray(keys) ? keys : keys.split('.');
  object = object[keys[0]];
  if (object && keys.length > 1) {
    return getProp(object, keys.slice(1));
  }
  return object === undefined ? defaultVal : object;
}
