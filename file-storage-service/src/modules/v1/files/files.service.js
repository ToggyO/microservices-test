/**
 * Описание: Файл содержит сервис для модуля работы с файлами
 */
import { db } from 'db';

const { Models } = db;

export const FileService = {};

/**
 * Получить файл по хэш-идентификатору
 * @param {object} conditions
 * @param {object} projection
 * @param {object} options
 * @returns {Promise<object>}
 */
FileService.getFileData = async ({
  conditions = {},
  projection = {},
  options = {},
}) => (
  Models.FileModel.findOne(conditions, projection, options)
);

FileService.saveFileData = async ({ values }) => {
  await Models.FileModel.insertMany();
};
