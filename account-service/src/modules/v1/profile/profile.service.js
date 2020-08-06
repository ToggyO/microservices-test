/**
 * Описание: Файл содержит сервис для модуля профиля текущего пользователя
 */
import { basicService, imageProcessing } from '@utils/helpers';
import { getAxios } from '@utils/network/axiosClient';

export const ProfileService = Object.create(basicService);

ProfileService.uploadAvatar = async ({ avatar }) => {
  const axios = getAxios();
  const transformed = await imageProcessing(avatar);
  console.log(transformed);
  const response = await axios.post('http://0.0.0.0:3011/files', { files: transformed });

  return response;
};
