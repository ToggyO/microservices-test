/**
 * Описание: Файл содержит класс для работы с криптографическим функционалом
 */
import crypto from 'crypto';
import config from '../../config';

export class customCrypto {
  static #algorithm = 'aes-192-cbc';

  static #key = crypto.scryptSync(config.CRYPTO_SECRET, 'salt', 24);

  static #iv = Buffer.alloc(16, 0);

  /**
   * Зашифровать строку
   * @param {string} string - строка для шифрования
   * @returns {string} - шифр
   */
  static encrypt = string => {
  	const cipher = crypto.createCipheriv(this.#algorithm, this.#key, this.#iv);
  	let encrypted = cipher.update(string, 'utf8', 'hex');
  	encrypted += cipher.final('hex');
  	return encrypted;
  }

	/**
   * Расшифровать строку
   * @param {string} encryptedString - строка для расшифровки
   * @returns {string} - расшифрованная строка
   */
	static decrypt = encryptedString => {
	  const decipher = crypto.createDecipheriv(this.#algorithm, this.#key, this.#iv);
	  let decrypted = decipher.update(encryptedString, 'utf8', 'hex');
	  decrypted += decipher.final('utf8');
	  return decrypted;
	};
}
