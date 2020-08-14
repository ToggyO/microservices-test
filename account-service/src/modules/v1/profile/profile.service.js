/**
 * Описание: Файл содержит сервис для модуля профиля текущего пользователя
 */
import { basicService } from '@utils/helpers';
import { getAxios } from '@utils/network/axiosClient';
import { ApplicationError } from '@utils/response';
import { UserModel } from '../user/user.model';

export const ProfileService = Object.create(basicService);

/**
 * Загрузить аватар на сервис хранения файлов
 * @param {object} avatar - обработанный multer-ом файл
 * @param {number | string} id - идентиатор пользователя
 * @param {string} oldHash - имя существующего файла
 * @returns {Promise<object>}
 */
ProfileService.uploadAvatar = async ({ avatar, id, oldHash }) => {
  const axios = getAxios();
  const response = await axios.post(
    'http://0.0.0.0:3011/files',
    { files: avatar, ownerType: 'users', oldHash },
  );

  if (response.status !== 201) {
    const { status, data = {} } = response;
    const { errorCode, errorMessage, errors = [] } = data;
    throw new ApplicationError({
      statusCode: status,
      errorCode,
      errorMessage,
      errors,
    });
  }

  const { data = {} } = response;
  const { resultData } = data;

  await UserModel.update(
    { avatar: resultData[0].hash },
    {
      where: { id },
      returning: false,
    },
  );

  return resultData;
};

/**
 * Удалить аватар с сервиса хранения файлов
 * @param {number | string} id - идентиатор пользователя
 * @param {object} file - объект с ссылками на файлы, именем файла
 * @returns {Promise<object>}
 */
ProfileService.deleteAvatar = async ({ id, file }) => {
  const axios = getAxios();

  const getImageResolutions = Object.keys(file).reduce((acc, key) => {
    if (key === 'originalFile' || key === 'fileName') {
      return acc;
    }
    acc.push(key);
    return acc;
  }, []);

  const response = await axios.delete(
    'http://0.0.0.0:3011/files',
    {
      data: {
        fileName: file.fileName,
        resolutions: getImageResolutions,
      },
    },
  );

  if (response.status !== 200) {
    const { status, data = {} } = response;
    const { errorCode, errorMessage, errors = [] } = data;
    throw new ApplicationError({
      statusCode: status,
      errorCode,
      errorMessage,
      errors,
    });
  }

  await UserModel.update(
    { avatar: null },
    {
      where: { id },
      returning: false,
    },
  );

  return null;
};
