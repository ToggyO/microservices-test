/**
 * Парсер фильтра по стандарту Leopold
 */
import { ApplicationError } from '@utils/response';
import { BAD_PARAMETERS } from '@constants/response-codes';

/**
 * Преобразование массива строк вида 'field operation value' в массив объектов
 * вида { field, operation, stringValue }
 * @param {[string]} filter - массив фильтров в формате строки
 * @returns {[object]}
 */
export const leopoldFilterParser = filter => {
  const parsedFilter = [];

  if (!Array.isArray(filter)) {
    throw new ApplicationError({
      statusCode: 400,
      errorCode: BAD_PARAMETERS,
      errorMessage: 'Filter must be an array',
      errors: [
        {
          errorCode: BAD_PARAMETERS,
          errorMessage: 'Filter must be an array',
          field: 'filter',
        },
      ],
    });
  }

  const errors = [];

  filter.forEach((expression, index) => {
    const filterValues = expression.split(' ');
    const field = filterValues[0];
    const operation = filterValues[1];
    const stringValue = filterValues[2];
    // const field = filterValues.shift();
    // const operation = filterValues.shift();
    // const stringValue = filterValues.join(' ');

    if (!field || !operation || !stringValue) {
      errors.push({
        errorCode: BAD_PARAMETERS,
        errorMessage: 'Wrong format of filter, must be: "<field> <operation> <value>"',
        field: `filter[${index}]`,
      });
    }

    parsedFilter.push({ field, operation, stringValue });
  });

  if (errors.length) {
    throw new ApplicationError({
      errorMessage: 'Wrong format of filter, must be: "<field> <operation> <value>"',
      statusCode: 400,
      code: BAD_PARAMETERS,
      errors,
    });
  }

  return parsedFilter;
};
