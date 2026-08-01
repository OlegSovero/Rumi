export type PictogramCategory = 'communication' | 'food' | 'play' | 'animals' | 'routine' | 'objects' | 'people';

export type PictogramEntry = {
  id: number;
  etiqueta: string;
  sinonimos: string[];
  categoria: PictogramCategory;
  accionesRelacionadas: string[];
  contextos: string[];
};

// Catalogo local de los pictogramas incluidos en public/pictograms.
// El catalogo es inmutable; las tareas y preferencias del usuario viven en localStorage.
export const PICTOGRAM_CATALOG = [
  { id: 6632, etiqueta: 'yo', sinonimos: ['me', 'mi'], categoria: 'communication', accionesRelacionadas: ['decir', 'señalar'], contextos: ['comunicar necesidades'] },
  { id: 11538, etiqueta: 'quiero', sinonimos: ['desear', 'necesitar'], categoria: 'communication', accionesRelacionadas: ['pedir', 'elegir'], contextos: ['pedir algo'] },
  { id: 3220, etiqueta: 'más', sinonimos: ['otra vez', 'otro'], categoria: 'communication', accionesRelacionadas: ['pedir', 'repetir'], contextos: ['comunicar necesidades'] },
  { id: 19524, etiqueta: 'ayuda', sinonimos: ['ayudar', 'socorro'], categoria: 'communication', accionesRelacionadas: ['pedir', 'acompañar'], contextos: ['comunicar necesidades', 'rutinas'] },
  { id: 5526, etiqueta: 'no', sinonimos: ['rechazo', 'negación'], categoria: 'communication', accionesRelacionadas: ['rechazar', 'parar'], contextos: ['comunicar necesidades'] },
  { id: 8129, etiqueta: 'gracias', sinonimos: ['agradecer'], categoria: 'communication', accionesRelacionadas: ['responder'], contextos: ['comunicar necesidades'] },
  { id: 2248, etiqueta: 'agua', sinonimos: ['beber'], categoria: 'food', accionesRelacionadas: ['beber', 'servir'], contextos: ['comida', 'rutina'] },
  { id: 2259, etiqueta: 'comida', sinonimos: ['comer', 'alimento'], categoria: 'food', accionesRelacionadas: ['comer', 'preparar'], contextos: ['comida'] },
  { id: 2281, etiqueta: 'bocadillo', sinonimos: ['sándwich'], categoria: 'food', accionesRelacionadas: ['comer', 'preparar'], contextos: ['comida', 'escuela'] },
  { id: 2502, etiqueta: 'tarta', sinonimos: ['pastel'], categoria: 'food', accionesRelacionadas: ['comer', 'celebrar'], contextos: ['comida', 'celebraciones'] },
  { id: 2503, etiqueta: 'patata', sinonimos: ['papa'], categoria: 'food', accionesRelacionadas: ['comer', 'cocinar'], contextos: ['comida'] },
  { id: 2505, etiqueta: 'pasta', sinonimos: ['espagueti'], categoria: 'food', accionesRelacionadas: ['comer', 'cocinar'], contextos: ['comida'] },
  { id: 2269, etiqueta: 'pelota', sinonimos: ['balón'], categoria: 'play', accionesRelacionadas: ['jugar', 'lanzar'], contextos: ['juego', 'parque'] },
  { id: 2514, etiqueta: 'tenis', sinonimos: ['deporte'], categoria: 'play', accionesRelacionadas: ['jugar', 'golpear'], contextos: ['juego', 'parque'] },
  { id: 2506, etiqueta: 'patines', sinonimos: ['patinar'], categoria: 'play', accionesRelacionadas: ['ponerse', 'patinar'], contextos: ['juego', 'parque'] },
  { id: 2507, etiqueta: 'monopatín', sinonimos: ['patinete', 'skate'], categoria: 'play', accionesRelacionadas: ['montar', 'jugar'], contextos: ['juego', 'parque'] },
  { id: 2521, etiqueta: 'piano', sinonimos: ['música'], categoria: 'play', accionesRelacionadas: ['tocar', 'escuchar'], contextos: ['juego', 'casa'] },
  { id: 2283, etiqueta: 'bolos', sinonimos: ['juego de bolos'], categoria: 'play', accionesRelacionadas: ['jugar', 'lanzar'], contextos: ['juego'] },
  { id: 2517, etiqueta: 'perro', sinonimos: ['mascota', 'perrito'], categoria: 'animals', accionesRelacionadas: ['ver', 'acariciar', 'pasear'], contextos: ['animales', 'casa', 'parque'] },
  { id: 2294, etiqueta: 'caballo', sinonimos: ['caballito'], categoria: 'animals', accionesRelacionadas: ['ver', 'montar'], contextos: ['animales'] },
  { id: 2295, etiqueta: 'cabra', sinonimos: [], categoria: 'animals', accionesRelacionadas: ['ver', 'alimentar'], contextos: ['animales'] },
  { id: 2291, etiqueta: 'burro', sinonimos: [], categoria: 'animals', accionesRelacionadas: ['ver', 'alimentar'], contextos: ['animales'] },
  { id: 2268, etiqueta: 'ballena', sinonimos: [], categoria: 'animals', accionesRelacionadas: ['ver'], contextos: ['animales'] },
  { id: 2257, etiqueta: 'ardilla', sinonimos: [], categoria: 'animals', accionesRelacionadas: ['ver'], contextos: ['animales', 'parque'] },
  { id: 2271, etiqueta: 'bañarse', sinonimos: ['baño', 'ducha', 'ducharse', 'lavarse'], categoria: 'routine', accionesRelacionadas: ['abrir', 'lavar', 'secar'], contextos: ['higiene', 'rutina'] },
  { id: 2522, etiqueta: 'dormir', sinonimos: ['siesta', 'acostarse'], categoria: 'routine', accionesRelacionadas: ['preparar', 'descansar'], contextos: ['noche', 'rutina'] },
  { id: 2256, etiqueta: 'parque', sinonimos: ['salir'], categoria: 'routine', accionesRelacionadas: ['ir', 'jugar', 'volver'], contextos: ['salir', 'juego'] },
  { id: 2255, etiqueta: 'familia', sinonimos: ['personas'], categoria: 'people', accionesRelacionadas: ['ver', 'saludar'], contextos: ['casa', 'personas'] },
  { id: 2253, etiqueta: 'gato', sinonimos: ['gatito', 'mascota'], categoria: 'animals', accionesRelacionadas: ['ver', 'acariciar'], contextos: ['animales', 'casa'] },
  { id: 2270, etiqueta: 'muñeca', sinonimos: ['juguete'], categoria: 'play', accionesRelacionadas: ['jugar', 'guardar'], contextos: ['juego', 'casa'] },
  { id: 2277, etiqueta: 'libro', sinonimos: ['cuento', 'leer'], categoria: 'objects', accionesRelacionadas: ['leer', 'guardar', 'llevar'], contextos: ['escuela', 'casa', 'mochila'] },
  { id: 2288, etiqueta: 'coche', sinonimos: ['auto', 'carro'], categoria: 'objects', accionesRelacionadas: ['subir', 'viajar', 'salir'], contextos: ['salir', 'transporte'] },
  { id: 2296, etiqueta: 'casa', sinonimos: ['hogar'], categoria: 'objects', accionesRelacionadas: ['volver', 'entrar', 'salir'], contextos: ['casa', 'rutina'] },
  { id: 2523, etiqueta: 'leche', sinonimos: ['beber'], categoria: 'food', accionesRelacionadas: ['beber', 'servir'], contextos: ['comida', 'rutina'] },
  { id: 8367, etiqueta: 'sábana', sinonimos: ['cama'], categoria: 'objects', accionesRelacionadas: ['estirar', 'poner', 'lavar'], contextos: ['dormitorio', 'rutina'] },
  { id: 2250, etiqueta: 'almohada', sinonimos: ['cojín'], categoria: 'objects', accionesRelacionadas: ['poner', 'guardar'], contextos: ['dormitorio', 'rutina'] },
  { id: 2459, etiqueta: 'manta', sinonimos: ['edredón'], categoria: 'objects', accionesRelacionadas: ['poner', 'doblar', 'guardar'], contextos: ['dormitorio', 'rutina'] },
  { id: 5481, etiqueta: 'hacer la cama', sinonimos: ['tender la cama'], categoria: 'routine', accionesRelacionadas: ['estirar', 'poner', 'ordenar'], contextos: ['dormitorio', 'rutina'] },
  { id: 2694, etiqueta: 'coger el cepillo', sinonimos: ['cepillo'], categoria: 'routine', accionesRelacionadas: ['coger', 'cepillar'], contextos: ['higiene', 'baño'] },
  { id: 2737, etiqueta: 'cepillar los dientes', sinonimos: ['dientes', 'cepillar'], categoria: 'routine', accionesRelacionadas: ['coger', 'cepillar', 'enjuagar'], contextos: ['higiene', 'baño'] },
  { id: 8560, etiqueta: 'enjuagar la boca', sinonimos: ['enjuagar'], categoria: 'routine', accionesRelacionadas: ['enjuagar', 'escupir'], contextos: ['higiene', 'baño'] },
  { id: 9813, etiqueta: 'recoger los juguetes', sinonimos: ['juguetes', 'ordenar'], categoria: 'routine', accionesRelacionadas: ['recoger', 'guardar'], contextos: ['juego', 'casa'] },
  { id: 5935, etiqueta: 'caja', sinonimos: ['cajón', 'contenedor'], categoria: 'objects', accionesRelacionadas: ['poner', 'guardar', 'abrir'], contextos: ['casa', 'orden'] },
  { id: 5514, etiqueta: 'guardar', sinonimos: ['ordenar', 'recoger'], categoria: 'routine', accionesRelacionadas: ['guardar', 'ordenar'], contextos: ['casa', 'rutina'] },
  { id: 2622, etiqueta: 'zapatos', sinonimos: ['zapato', 'zapatillas'], categoria: 'objects', accionesRelacionadas: ['ponerse', 'quitarse', 'guardar'], contextos: ['vestirse', 'salir'] },
  { id: 2309, etiqueta: 'camiseta', sinonimos: ['camisa', 'ropa'], categoria: 'objects', accionesRelacionadas: ['ponerse', 'quitarse', 'guardar'], contextos: ['vestirse', 'rutina'] },
  { id: 2565, etiqueta: 'pantalón', sinonimos: ['pantalones', 'ropa'], categoria: 'objects', accionesRelacionadas: ['ponerse', 'quitarse', 'guardar'], contextos: ['vestirse', 'rutina'] },
  { id: 2298, etiqueta: 'calcetines', sinonimos: ['calcetín', 'medias'], categoria: 'objects', accionesRelacionadas: ['ponerse', 'quitarse', 'guardar'], contextos: ['vestirse', 'rutina'] },
  { id: 2475, etiqueta: 'mochila', sinonimos: ['bolso'], categoria: 'objects', accionesRelacionadas: ['preparar', 'guardar', 'llevar'], contextos: ['escuela', 'salir'] },
  { id: 2610, etiqueta: 'vaso', sinonimos: ['taza'], categoria: 'objects', accionesRelacionadas: ['coger', 'llenar', 'beber'], contextos: ['comida', 'casa'] },
  { id: 2593, etiqueta: 'secarse', sinonimos: ['toalla', 'secar'], categoria: 'routine', accionesRelacionadas: ['secar', 'guardar'], contextos: ['higiene', 'baño'] },
  { id: 2964, etiqueta: 'jabón', sinonimos: ['lavarse', 'manos'], categoria: 'objects', accionesRelacionadas: ['usar', 'lavar'], contextos: ['higiene', 'baño'] },
  { id: 2414, etiqueta: 'grifo', sinonimos: ['llave', 'agua'], categoria: 'objects', accionesRelacionadas: ['abrir', 'cerrar', 'lavar'], contextos: ['higiene', 'baño', 'cocina'] },
  { id: 2745, etiqueta: 'escoba', sinonimos: ['barrer', 'limpiar'], categoria: 'objects', accionesRelacionadas: ['barrer', 'limpiar', 'guardar'], contextos: ['casa', 'rutina'] },
] satisfies readonly PictogramEntry[];

export const PICTOGRAM_IDS = new Set(PICTOGRAM_CATALOG.map(({ id }) => id));

export function catalogoParaPrompt(): string {
  return PICTOGRAM_CATALOG
    .map(({ id, etiqueta, sinonimos, accionesRelacionadas, contextos }) =>
      `${id}: ${etiqueta}; sinonimos=${sinonimos.join(', ') || 'ninguno'}; acciones=${accionesRelacionadas.join(', ')}; contextos=${contextos.join(', ')}`)
    .join('\n');
}
