/**
 * Описание: Файл содержит сервис для модуля профиля текущего пользователя
 */
import { basicService } from '@utils/helpers';
import { getAxios } from '@utils/network/axiosClient';
import { ApplicationError } from '@utils/response';
import { UserModel } from '../user/user.model';

export const ProfileService = Object.create(basicService);

ProfileService.uploadAvatar = async ({ avatar, id }) => {
  const axios = getAxios();
  const response = await axios.post(
    'http://0.0.0.0:3011/files',
    { files: avatar, ownerType: 'users' },
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
