import { Op, Sequelize } from 'sequelize';
import { CronJob } from 'cron';

import config from '@config';
import { AuthModel } from '@modules/v1/auth/auth.model';

const CRON_PER_HALF_DAY = '0 0 01,13 * * *';
const CRON_PER_DAY = '0 0 23 * * *';

export async function cleanUpInvalidTokenHandler({ app }) {
  const log = app.get('log');
  try {
    await AuthModel.deleteRefreshTokens({
      where: {
        expiresIn: {
          [Op.lte]: Sequelize.fn('NOW'),
        },
      },
    });
    log.debug('Tokens clean up done');
  } catch (error) {
    log.error('Tokens clean up failed');
  }
}

/**
 * Запуск отложенной (запланированной) задачи на очистку невалидных токенов аутенификации пользователей
 * @param {object} app - экземпляр приложения
 * @param {string} cronTime - интервал запуска задачи
 * @param {boolean} start
 * @param {string} timeZone
 * @param {boolean} runOnInit
 * @returns {Promise<*>}
 */
export async function runCleanUpInvalidTokensJob({
  app,
  cronTime = CRON_PER_DAY,
  start = true,
  timeZone = 'Atlantic/Azores',
  runOnInit = false,
}) {
  return new CronJob({
    cronTime,
    onTick: async () => {
      await cleanUpInvalidTokenHandler({ app });
    },
    start,
    timeZone,
    runOnInit,
  });
}

/**
 * Запуск отложенных (запланированных) задач
 * @param {object} app - экземпляр приложения
 */
export async function run({ app }) {
  const cleanUpInvalidTokensJobCronTime = (
    (config.CRON_CHECK_INVALID_TOKENS_DELAY_SECS || 3600) < 24 * 60 * 60 ? CRON_PER_HALF_DAY : CRON_PER_DAY
  );
  await runCleanUpInvalidTokensJob({ app, cronTime: cleanUpInvalidTokensJobCronTime });
}
