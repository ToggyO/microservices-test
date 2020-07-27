/**
 * Описание: Файл содержит класс для работы с датами
 */

export class CustomDate extends Date {
	/**
	 * Метод для добавлнеия секунд к текущей дате
	 * @param {number} seconds - секунды (отрицательное, чтобы вычесть часы)
	 * @returns {CustomDate} - Результат
	 */
	addSeconds = seconds => {
	  this.setSeconds(this.getSeconds() + seconds);
	  return this;
	};

	/**
 * Метод для добавлнеия минут к текущей дате
 * @param {number} minutes - минуты (отрицательное, чтобы вычесть часы)
 * @returns {CustomDate} - Результат
 */
	addMinutes = minutes => {
	  this.setMinutes(this.getMinutes() + minutes);
	  return this;
	};

	/**
	 * Метод для добавлнеия часов к текущей дате
	 * @param {number} hours - часы (отрицательное, чтобы вычесть часы)
	 * @returns {CustomDate} - Результат
	 */
	addHours = hours => {
	  this.setHours(this.getHours() + hours);
	  return this;
	};

	/**
	 * Метод для добавлнеия дней к текущей дате
	 * @param {number} days - дни (отрицательное, чтобы вычесть часы)
	 * @returns {CustomDate} - Результат
	 */
	addDays = days => {
	  this.setDate(this.getDate() + days);
	  return this;
	};

	/**
	 * Метод для добавлнеия месяцев к текущей дате
	 * @param {number} months - количество месяцев (отрицательное, чтобы вычесть часы)
	 * @returns {CustomDate} - Результат
	 */
	addMonths = months => {
	  this.setMonth(this.getMonth() + months);
	  return this;
	};

	/**
	 * Метод для добавлнеия годов к текущей дате
	 * @param {number} years - количество лет (отрицательное, чтобы вычесть часы)
	 * @returns {CustomDate} - Результат
	 */
	addYears = years => {
	  this.setFullYear(this.getFullYear() + years);
	  return this;
	};
}
