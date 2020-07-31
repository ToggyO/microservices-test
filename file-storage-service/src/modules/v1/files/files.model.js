/**
 * Описание: Слой для работы с коллекцией файлов в базе данных
 */
import { db } from 'db';
import schema from 'db/models/file';

export const FileModel = {};

const mongooseInstance = db.getMongooseConnection();

FileModel.initializeModel = () => mongooseInstance.model('Files', schema);

export const initializeModel = () => {
  FileModel.init();

  return FileModel;
};
