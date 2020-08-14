/**
 * Описание: Конструктор сервисов, который используется для инициализации сервисов модулей
 */
import { getProp, isObjectEmpty } from './common';
import { leopoldFilterParser, leopoldFilterParserSequelize, leopoldSortParserSequelize } from '../leopold';

export const basicService = {
  /**
   * Подготовка данных по схеме модели
   * @param values
   * @param options
   * @returns {*}
   * @private
   */
  _useSchema: (values = {}, options = {}) => {
    const {
      model: { rawAttributes },
      modelSchemaKey = '',
      callback = (data) => data,
      additionalAttributes = [],
    } = options;
    const modelAttributes = ((list = []) => (
      list.reduce((accumulator, [key, value = {}] = []) => [
        ...accumulator,
        ...(key && value[modelSchemaKey] ? [key] : []),
      ], [...additionalAttributes])
    ))(Object.entries(rawAttributes));
    const allowedValues = Object.keys(values).reduce((accumulator, attrKey) => ({
      ...accumulator,
      ...(modelAttributes.includes(attrKey) ? { [attrKey]: values[attrKey] } : {}),
    }), {});

    if (callback) return callback(allowedValues);

    return allowedValues;
  },

  /**
   * Получить перечень доступных аттрибутов по схеме модели
   * @param {object} props
   * @param {object} props.model
   * @param {array} props.additionalAttributes
   * @returns {*}
   * @private
   */
  _getModelAttributes: (props = {}) => {
    const {
      model: { rawAttributes },
      additionalAttributes = [],
    } = props;
    return ((list = []) => (
      list.reduce((acc, [key, value = {}] = []) => [
        ...acc,
        ...(key && !value._isHidden ? [key] : []),
      ], [...additionalAttributes])
    ))(Object.entries(rawAttributes));
  },

  /**
   * Предварительная подготовка и форматирование входных данных на создание / изменение сущности
   * @param {object} payload
   * @param {object} schema
   * @returns {object|array}
   */
  _dryPayload: (payload = {}, schema = {}) => {
    return (
      Object.keys(schema).reduce((accumulator, propName) => {
        let data = {};
        try {
          const value = schema[propName](payload[propName]);
          if (typeof value !== 'undefined') {
            data[propName] = value;
          }
        } catch (error) {
          data = {};
        }
        return {
          ...accumulator,
          ...data,
        };
      }, {})
    );
  },

  /**
   * Использовать форматированный параметры пагинации `offset`, `limit`
   * @param {object} query
   * @returns {{offset: number, limit: *}|*}
   */
  _getPagination: ({ query = {} } = {}) => {
    let page = +getProp(query, 'page', 0);
    let pageSize = +getProp(query, 'pageSize', 0);

    if (Number.isNaN(page) || page < 0) { page = 0; }
    if (Number.isNaN(pageSize) || pageSize <= 0) { pageSize = 10; }

    return {
      offset: page * pageSize,
      limit: pageSize,
    };
  },

  /**
   * Парсинг сортировки из query параметров
   * @param {object} query
   * @returns {array}
   */
  _getSort: ({ query = {} } = {}) => {
    let sort = getProp(query, 'sort');

    if (!sort) {
      return [];
    }

    if (Array.isArray(sort) && sort.length > 1) {
      sort = [sort[0]];
    }

    if (typeof sort === 'string') {
      sort = [sort];
    }

    return leopoldSortParserSequelize(sort);
  },

  /**
   * Использовать форматированный параметр `filter`
   * @param {object} query
   * @returns {{}|*|{}}
   */
  _getFilter: ({ query = {} } = {}) => {
    let queryFilter = getProp(query, 'filter');

    if (!queryFilter) {
      return {};
    }

    if (typeof queryFilter === 'string') {
      queryFilter = [queryFilter];
    }

    const filterRaw = leopoldFilterParser(queryFilter);
    return leopoldFilterParserSequelize(filterRaw);
  },

  /**
   * Формат ответа с пагинацией
   * @param result
   * @param pagination
   * @returns {{}|{pagination: {total: *}}}
   * @private
   */
  _getPaginationResponse: (result = {}, pagination = {}) => {
    if (isObjectEmpty(pagination)) {
      return {};
    }

    return {
      pagination: {
        page: Math.abs(pagination.offset / pagination.limit),
        pageSize: pagination.limit,
        total: getProp(result, 'count', 0),
      },
    };
  },
};
