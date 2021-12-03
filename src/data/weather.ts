import { WindDirection } from 'Types/weather';

export const windDirections: WindDirection[] = [
  { name: 'North Northeast', min: 11.25, max: 33.74 },
  { name: 'Northeast', min: 33.75, max: 56.24 },
  { name: 'East Northeast', min: 56.25, max: 78.74 },
  { name: 'East', min: 78.75, max: 101.24 },
  { name: 'East Southeast', min: 101.25, max: 123.74 },
  { name: 'Southeast', min: 123.75, max: 146.24 },
  { name: 'South Southeast', min: 146.25, max: 168.74 },
  { name: 'South', min: 168.75, max: 191.24 },
  { name: 'South SouthWest', min: 191.25, max: 213.74 },
  { name: 'SouthWest', min: 213.75, max: 236.24 },
  { name: 'West SouthWest', min: 236.25, max: 258.74 },
  { name: 'West', min: 258.75, max: 281.24 },
  { name: 'West Northwest', min: 281.25, max: 303.74 },
  { name: 'Northwest', min: 303.75, max: 326.24 },
  { name: 'North Northwest', min: 326.25, max: 348.74 }
];
