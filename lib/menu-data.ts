export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  tags: ('popular' | 'premium' | 'spicy' | 'new' | 'vegetarian')[];
  image: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  accent: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'wok',
    name: 'Especialidades al Wok',
    subtitle: 'Chaufas & Aeropuertos',
    icon: '🔥',
    accent: '#E74C3C',
  },
  {
    id: 'sopas',
    name: 'Sopas Imperiales',
    subtitle: 'Caldos milenarios',
    icon: '🍜',
    accent: '#F39C12',
  },
  {
    id: 'acompañamientos',
    name: 'Acompañamientos',
    subtitle: 'Para compartir',
    icon: '🥟',
    accent: '#D4AC0D',
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    subtitle: 'Frescas & calientes',
    icon: '🍵',
    accent: '#27AE60',
  },
];

export const PRODUCTS: Product[] = [
  // ── Especialidades al Wok ───────────────────────────
  {
    id: 'w-01',
    name: 'Chaufa Imperial Dragon',
    description:
      'Arroz al wok con langostinos, calamar y pulpo salteados en sillao negro, jengibre fresco y aceite de sésamo. La estrella de la casa.',
    price: 52,
    categoryId: 'wok',
    tags: ['popular', 'premium'],
    image: 'https://images.pexels.com/photos/1707917/pexels-photo-1707917.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'w-02',
    name: 'Chaufa de Pollo Especial',
    description:
      'Tiernos trozos de pollo marinados 24 horas en especias orientales, wok al fuego vivo con cebollita china, poro y huevo revuelto.',
    price: 32,
    categoryId: 'wok',
    tags: ['popular'],
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'w-03',
    name: 'Aeropuerto Dragon Gold',
    description:
      'La fusión perfecta: chaufa y tallarín salteados juntos con lomo fino, camarones y verduras crujientes. Un clásico elevado.',
    price: 45,
    categoryId: 'wok',
    tags: ['premium', 'popular'],
    image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'w-04',
    name: 'Chaufa Combinado Supremo',
    description:
      'Pollo, cerdo y langostinos en un mismo wok, sazonados con los secretos ancestrales del chef. Aroma y sabor en cada bocado.',
    price: 48,
    categoryId: 'wok',
    tags: ['premium'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'w-05',
    name: 'Tallarin Saltado con Res',
    description:
      'Fideos de arroz wok con lomo fino, tomate riñón, cebolla roja y sillao dulce. Un abrazo oriental en el plato.',
    price: 38,
    categoryId: 'wok',
    tags: ['popular', 'spicy'],
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },

  // ── Sopas Imperiales ────────────────────────────────
  {
    id: 's-01',
    name: 'Sopa Wantán Imperial',
    description:
      'Caldo dorado de pollo con cinco especias, generosos wantanes rellenos de cerdo y camarón, hongos mu-err y cebollita verde. Reconfortante.',
    price: 28,
    categoryId: 'sopas',
    tags: ['popular'],
    image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 's-02',
    name: 'Sopa Fuchifu Clásica',
    description:
      'Espesa y potente: caldo de res con rábano, fideos de celofán, pak choi y un huevo pochado. Tradición chifa en cada cucharada.',
    price: 26,
    categoryId: 'sopas',
    tags: [],
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 's-03',
    name: 'Caldo Mariscos Imperial',
    description:
      'Bisque profundo con langostinos, conchas de abanico y calamares, infusionado con jengibre y lemongrass. Umami puro.',
    price: 35,
    categoryId: 'sopas',
    tags: ['premium', 'new'],
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },

  // ── Acompañamientos ─────────────────────────────────
  {
    id: 'a-01',
    name: 'Wantán Frito (8 pzs)',
    description:
      'Masa fina y crujiente rellena de cerdo y camarón, frita en aceite de cacahuate. Servidos con salsa agridulce de guindilla.',
    price: 18,
    categoryId: 'acompañamientos',
    tags: ['popular'],
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'a-02',
    name: 'Siu Mai al Vapor (6 pzs)',
    description:
      'Delicadas empanadillas al vapor rellenas de cerdo, gambas y setas shiitake, coronadas con huevas de tobiko naranja.',
    price: 22,
    categoryId: 'acompañamientos',
    tags: ['premium', 'popular'],
    image: 'https://images.pexels.com/photos/6646069/pexels-photo-6646069.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'a-03',
    name: 'Arroz Blanco Jazmín',
    description:
      'Arroz de jazmín tailandés cocido al vapor. Perfumado, esponjoso y listo para acompañar cualquier plato principal.',
    price: 8,
    categoryId: 'acompañamientos',
    tags: ['vegetarian'],
    image: 'https://images.pexels.com/photos/1350197/pexels-photo-1350197.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'a-04',
    name: 'Pan Chino Bao (4 pzs)',
    description:
      'Bollitos al vapor esponjosos rellenos de char siu (cerdo asado al miel). Un bocado que transporta a Cantón.',
    price: 16,
    categoryId: 'acompañamientos',
    tags: ['new'],
    image: 'https://images.pexels.com/photos/5409013/pexels-photo-5409013.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },

  // ── Bebidas ─────────────────────────────────────────
  {
    id: 'b-01',
    name: 'Chicha Morada Premium',
    description:
      'Maíz morado peruano hervido con canela, clavo, piña y membrillo. Dulce, especiado y completamente único en el mundo.',
    price: 12,
    categoryId: 'bebidas',
    tags: ['popular'],
    image: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'b-02',
    name: 'Té de Jazmín Ceremonial',
    description:
      'Hojas verdes de primera cosecha infusionadas con pétalos de jazmín auténtico. Servido en tetera de porcelana para 2.',
    price: 18,
    categoryId: 'bebidas',
    tags: ['premium'],
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'b-03',
    name: 'Limonada de Maracuyá',
    description:
      'Maracuyá fresco peruano, limón sutil, jarabe de jengibre y agua mineral. Cítrico, tropical y refrescante.',
    price: 14,
    categoryId: 'bebidas',
    tags: [],
    image: 'https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 'b-04',
    name: 'Cerveza Tsingtao',
    description:
      'La cerveza lager china por excelencia. Ligera, limpia y perfecta para acompañar cualquier plato oriental.',
    price: 16,
    categoryId: 'bebidas',
    tags: [],
    image: 'https://images.pexels.com/photos/1267358/pexels-photo-1267358.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
];
