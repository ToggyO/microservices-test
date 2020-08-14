/**
 * Парсер сортировки по стандарту Leopold и преобразование к формату sequelize
 * @param {[string]} sort - массив сортировок
 * @returns {array} - массив сортировок для sequelize
 */
export const leopoldSortParserSequelize = (sort = []) => sort.map(sortOptions => {
  const direction = sortOptions[0] === '!' ? 'DESC' : 'ASC';
  const clearSortOptions = sortOptions.replace('!', '');
  const sortOptionArray = clearSortOptions.split('.');
  return [...sortOptionArray, direction];
});
