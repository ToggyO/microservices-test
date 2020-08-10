/**
 * Описание: Файл содержит сервис для модуля профиля текущего пользователя
 */
import { basicService, getResizedImage } from '@utils/helpers';
import { getAxios } from '@utils/network/axiosClient';
import { ApplicationError } from '@utils/response';

export const ProfileService = Object.create(basicService);

ProfileService.uploadAvatar = async ({ avatar }) => {
  const axios = getAxios();
  const transformed = await getResizedImage(avatar);
  const response = await axios.post(
    'http://0.0.0.0:3011/files',
    { files: transformed, ownerType: 'users' },
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

  return response;
};
