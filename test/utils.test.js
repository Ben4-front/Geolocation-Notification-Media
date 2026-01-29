import { parseCoordinates } from '../src/js/utils';

test.each([
  ['51.50851, -0.12572', { latitude: 51.50851, longitude: -0.12572 }],
  ['51.50851,-0.12572', { latitude: 51.50851, longitude: -0.12572 }],
  ['[51.50851, -0.12572]', { latitude: 51.50851, longitude: -0.12572 }],
])('should parse valid coordinates: %s', (input, expected) => {
  expect(parseCoordinates(input)).toEqual(expected);
});

test('should throw error on invalid format', () => {
  expect(() => parseCoordinates('abc, def')).toThrow();
  expect(() => parseCoordinates('123')).toThrow();
  expect(() => parseCoordinates('1000, 1000')).toThrow(); // Out of range logic
});