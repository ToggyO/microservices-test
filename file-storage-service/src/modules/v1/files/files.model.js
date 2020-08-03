/**
 * Описание: Слой для работы с коллекцией файлов в базе данных
 */
import fileSchema from 'db/models/file';

export class FileModel {
  #model = null;

  #connection = null;

  constructor({ connection }) {
    const schema = fileSchema;

    this.#connection = connection;

    this.#model = this.#connection.model('Files', schema);
  }

  get model() {
    return this.#model;
  }
}
