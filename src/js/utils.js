/**
 * Парсит строку координат.
 * Допустимые форматы: "lat, long", "lat,long", "[lat, long]"
 * @param {string} input 
 * @returns {object} { latitude, longitude }
 */
export function parseCoordinates(input) {

  let cleanInput = input.replace(/^\[/, '').replace(/\]$/, '');
  
  const parts = cleanInput.split(',');

  if (parts.length !== 2) {
    throw new Error('Invalid coordinate format');
  }

  const latitude = parseFloat(parts[0].trim());
  const longitude = parseFloat(parts[1].trim());

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid coordinate format');
  }

  
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
     throw new Error('Coordinates out of range');
  }

  return { latitude, longitude };
}

export function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}