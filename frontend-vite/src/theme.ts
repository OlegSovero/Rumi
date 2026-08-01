// Tokens de diseño de Rumi, portados 1:1 del handoff original
// (mini-proyectos/rumi-demo/src/constants/theme.ts).
// Tema único y fijo: sin modo oscuro. Para autismo, un cambio de tema
// disparado por el sistema operativo es una sorpresa visual no deseada.

export const Colors = {
  cream50: '#FBF8F2',
  cream100: '#F5EEE1',
  sand200: '#EBE3D4',
  sand300: '#DDD3C0',
  taupe400: '#B4AB99',
  ink600: '#6E675B',
  ink800: '#4A4539',
  ink900: '#332F27',
  white: '#FFFFFF',

  teal100: '#DEEDEA',
  teal200: '#BEDCD6',
  teal400: '#6FACA4',
  teal500: '#5A9E95',
  teal600: '#4A8981',
  teal700: '#3C7169',

  apricot100: '#FBEAD6',
  apricot300: '#F3C495',
  apricot400: '#EEA96B',
  apricot500: '#E5934C',

  sky100: '#E4EDF4',
  sky300: '#A8C4DA',
  sky400: '#7FA8C9',
  sky500: '#6892B7',

  success100: '#E4F0E0',
  success400: '#91C08D',
  success500: '#7BB177',
  notice100: '#FBF0D6',
  notice500: '#E3B355',

  catPeople: '#E9D9E6',
  catActions: '#DCE7CE',
  catFood: '#F6E1CE',
  catFeelings: '#F5D9D6',
  catPlaces: '#D6E4E8',
  catThings: '#E6E2D2',
} as const;

export type Tinte = 'people' | 'actions' | 'food' | 'feelings' | 'places' | 'things';

export const TintesCategoria: Record<Tinte, string> = {
  people: Colors.catPeople,
  actions: Colors.catActions,
  food: Colors.catFood,
  feelings: Colors.catFeelings,
  places: Colors.catPlaces,
  things: Colors.catThings,
};
