/**
 * Описание: Файл для запуска приложения через @babel/register для development окружения
 */
require('@babel/register');
module.exports = require('./index.js').init;
