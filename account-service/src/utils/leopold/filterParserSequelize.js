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
 * Конкатенация фильтров для одного поля, которые должны применяться через оператор "И"
 * @param {object} field
 * @param {object} filter
 * @returns {object}
 */
const _addAndFilter = (field = {}, filter = {}) => {
  return { ...field, ...filter };
};

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

    if (field && field.split('.').length > 1) {
      field = `$${field}$`;
    }

    switch (operation) {
      case 'eq':
        filterTarget[field] = { [Op.eq]: value };
        break;
      case 'neq':
        filterTarget[field] = { [Op.ne]: value };
        break;
      case 'nnull':
        filterTarget[field] = { [Op.ne]: null };
        break;
      case 'in':
        filterTarget[field] = { [Op.in]: value };
        break;
      case 'lk':
        filterTarget[field] = { [Op.iLike]: value };
        break;
      case 'sw':
        filterTarget[field] = { [Op.startsWith]: value };
        break;
      case 'ew':
        filterTarget[field] = { [Op.endsWith]: value };
        break;
      case 'gt':
        filterTarget[field] = _addAndFilter(filterTarget[field], { [Op.gt]: value });
        break;
      case 'gte':
        filterTarget[field] = _addAndFilter(filterTarget[field], { [Op.gte]: value });
        break;
      case 'lt':
        filterTarget[field] = _addAndFilter(filterTarget[field], { [Op.lt]: value });
        break;
      case 'lte':
        filterTarget[field] = _addAndFilter(filterTarget[field], { [Op.lte]: value });
        break;
      default:
        filterTarget[field][operation] = value;
        break;
    }
  });

  return filter;
};
