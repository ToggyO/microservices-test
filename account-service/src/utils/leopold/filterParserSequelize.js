/**
 * Парсер фильтра по стандарту Leopold я Sequelize
 */
import Sequelize from 'sequelize';
// FIXME: delete
// const Sequelize = require('sequelize');

import { ApplicationError } from '@utils/response';
import { BAD_PARAMETERS } from '@constants';

const { Op } = Sequelize;

/**
 * Преобразование массива фильтров в объект,
 * который может быть подставлен в опцию where запросов к БД через sequelize
 * @param {array} filterArray - массив фильтров
 * @returns {object}
 */
export const leopoldFilterParserSequelize = (filterArray = []) => {
  if (!Array.isArray(filterArray)) {
    throw new ApplicationError({
      errorMessage: 'Filter must be an array',
      statusCode: 400,
      code: BAD_PARAMETERS,
      errors: [{
        code: BAD_PARAMETERS,
        message: 'Filter must be an array',
        field: 'filter',
      }],
    });
  }

  const filter = {};

  filterArray.forEach(expression => {
    const { field: fieldDefinition, operation, stringValue } = expression;

    let value;

    try {
      value = JSON.parse(stringValue);
    } catch (error) {
      value = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(stringValue)
        ? new Date(stringValue)
        : stringValue;
    }

    let filterTarget;
    let field;
    if (fieldDefinition[0] === '$') {
      field = fieldDefinition.replace('$', '');
      filter[Op.or] = filter[Op.or] || {};
      filterTarget = filter[Op.or];
    } else {
      field = fieldDefinition;
      filterTarget = filter;
    }


  });

  return filter;
};
