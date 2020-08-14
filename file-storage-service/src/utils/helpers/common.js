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

/**
 * Отделение расширения файла от имени
 * @param {string} filename - объект
 * @returns {[string, string]}
 *    первый элемент - имя файла
 *    первый элемент - расширение файла
 */
export function getFileExtension(filename) {
  const fileName = filename.replace(/\.[^/.]+$/, '');
  const ext = filename.split('.').pop();
  return [fileName, ext];
}

/**
 * Парсинг входящей URI вплоть до 3-х элементов через слэш "/"
 * @param {string} pathname - строка URI
 * @returns {object} - объект с параметрами URI
 */
export function parseFileRequestURL(pathname) {
  const splittedPathname = pathname.split('/');
  return splittedPathname.reverse().reduce((acc, curr, index) => {
    let key = null;
    switch (index) {
      case 0:
        return {
          ...acc,
          hash: curr,
        };
      case 1:
        if (splittedPathname.length > 2) {
          key = 'subDir';
        } else {
          key = 'ownerType';
        }
        return {
          ...acc,
          [key]: curr,
        };
      case 2:
        return {
          ...acc,
          ownerType: curr,
        };
      default:
        return acc;
    }
  }, {});
}
