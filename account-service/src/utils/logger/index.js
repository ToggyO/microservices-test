/**
 * Описание: Файл для инициализации логгера.
 * Логгер может быть запущен в development(логирование в консоль) и production(логирование в файл) режимах.
 */
import ProdLogger from './strategies/production';
import LocalDevLogger from './strategies/local';

/**
 * Система логирования
 * @param {object} props - опции для инициализации
 * @returns {object} - логгер
 */
export default function (props = {}) {
  const { mode = 'development' } = props;
  return mode === 'production' ? new ProdLogger(props) : new LocalDevLogger(props);
}
