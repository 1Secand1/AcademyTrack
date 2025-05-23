import * as XLSX from 'xlsx';

/**
 * Сервис для экспорта данных в Excel
 */
class ExportService {
  /**
   * Экспорт данных в Excel файл
   * @param {Array} data - Массив объектов для экспорта
   * @param {string} filename - Имя файла без расширения
   * @param {Object} options - Дополнительные опции
   * @param {string} options.sheetName - Название листа (по умолчанию 'Sheet1')
   * @param {Array} options.headers - Заголовки колонок (по умолчанию берутся из первого объекта)
   */
  exportToExcel(data, filename, options = {}) {
    try {
      if (!data || !data.length) {
        throw new Error('Нет данных для экспорта');
      }

      // Создаем рабочую книгу
      const wb = XLSX.utils.book_new();
      
      // Подготавливаем данные
      const headers = options.headers || Object.keys(data[0]);
      const rows = data.map(item => 
        headers.map(header => this.formatValue(item[header]))
      );

      // Создаем лист
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

      // Устанавливаем ширину колонок
      const colWidths = headers.map(header => ({
        wch: Math.max(header.length, 15) // Минимальная ширина 15 символов
      }));
      ws['!cols'] = colWidths;

      // Добавляем лист в книгу
      XLSX.utils.book_append_sheet(
        wb, 
        ws, 
        options.sheetName || 'Sheet1'
      );

      // Сохраняем файл
      XLSX.writeFile(wb, `${filename}.xlsx`);
      
      return true;
    } catch (error) {
      console.error('Ошибка при экспорте в Excel:', error);
      throw error;
    }
  }

  /**
   * Форматирование значения для Excel
   * @param {*} value - Значение для форматирования
   * @returns {*} Отформатированное значение
   */
  formatValue(value) {
    if (value === null || value === undefined) return 'Н/Д';
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value ? 'Да' : 'Нет';
    return String(value).trim();
  }

  /**
   * Генерация имени файла
   * @param {string} prefix - Префикс имени файла
   * @param {string} id - Идентификатор (например, ID группы)
   * @returns {string} Имя файла
   */
  generateFilename(prefix, id) {
    const date = new Date().toISOString().split('T')[0];
    return `${prefix}_${id}_${date}`;
  }
}

export const exportService = new ExportService(); 