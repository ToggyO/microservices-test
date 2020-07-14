/**
 * Описание: импорт babel/register для корректной работы команды миграции и seed для sequelize
 */
require('@babel/register');
module.exports = require('./config.js');
