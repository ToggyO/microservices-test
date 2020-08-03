/**
 * Описание: схемы для моделей коллекции files
 */
import { Schema } from 'mongoose';

const schema = new Schema(
  {
    hash: {
      type: String,
      required: true,
    },
    ownerType: {
      type: String,
      required: true,
    },
    pathToFile: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  {
    autoIndex: true,
    timestamps: true,
  },
);

export default schema;
