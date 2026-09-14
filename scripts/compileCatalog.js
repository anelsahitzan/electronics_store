const fs = require('fs');
const path = require('path');
const { images, categoriesConfig, targetPath } = require('./catalogBase');
const catalogData1 = require('./catalogData1');
const catalogData2 = require('./catalogData2');

const allCategoryData = { ...catalogData1, ...catalogData2 };

// Helper to create slug from title
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const colorPalettes = [
  [
    { name: 'Космический черный', hex: '#1e293b', inStock: true },
    { name: 'Серебристый металлик', hex: '#e2e8f0', inStock: true },
    { name: 'Глубокий синий', hex: '#1e3a8a', inStock: true },
  ],
  [
    { name: 'Матовый черный', hex: '#0f172a', inStock: true },
    { name: 'Белый лед', hex: '#f8fafc', inStock: true },
  ],
  [
    { name: 'Титановый серый', hex: '#475569', inStock: true },
    { name: 'Натуральный титан', hex: '#94a3b8', inStock: true },
    { name: 'Пустынный беж', hex: '#d97706', inStock: true },
  ],
  [
    { name: 'Карбоновый черный', hex: '#18181b', inStock: true },
    { name: 'Серый антрацит', hex: '#3f3f46', inStock: true },
  ]
];

const generatedProducts = [];
const categoryCounts = {};

categoriesConfig.forEach((cat) => {
  const items = allCategoryData[cat.slug] || [];
  categoryCounts[cat.slug] = items.length;

  items.forEach((item, idx) => {
    const rawSlug = slugify(item.title) || `${cat.slug}-${idx + 1}`;
    const id = `prod-${cat.slug}-${idx + 1}-${rawSlug.slice(0, 20)}`;
    const categoryImages = images[cat.slug] || images.smartphones;
    const mainImg = categoryImages[idx % categoryImages.length];
    const gallery = [
      mainImg,
      categoryImages[(idx + 1) % categoryImages.length],
      categoryImages[(idx + 2) % categoryImages.length],
    ];

    const discountPercent = item.oldPrice && item.oldPrice > item.price
      ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
      : undefined;

    const salesCount = 20 + ((idx * 37 + item.price % 97) % 650);
    const rating = Number((4.6 + ((idx * 7) % 5) * 0.1).toFixed(1));
    const reviewsCount = 8 + ((idx * 13) % 95);

    // Color options
    const colors = colorPalettes[idx % colorPalettes.length];

    // Storage / variant options
    let storageOptions = [];
    if (item.storage && item.storage.includes('GB')) {
      storageOptions = [
        { capacity: item.storage, priceOffset: 0 },
        { capacity: item.storage.replace('128', '256').replace('256', '512').replace('512', '1 TB'), priceOffset: 45000 },
      ];
    } else if (item.ram && item.ssd) {
      storageOptions = [
        { capacity: `${item.ram} / ${item.ssd}`, priceOffset: 0 },
        { capacity: `${item.ram} / 1 TB`, priceOffset: 60000 },
      ];
    } else {
      storageOptions = [
        { capacity: 'Базовая комплектация', priceOffset: 0 },
        { capacity: 'Расширенная гарантия 2 года', priceOffset: 15000 }
      ];
    }

    // Dynamic specs
    const specsObj = {
      'Основные характеристики': {
        'Бренд': item.brand,
        'Категория': cat.name,
        'Модель': item.title,
        'Гарантия': '12 месяцев официальной гарантии'
      }
    };

    const techSpecs = {};
    if (item.screen) techSpecs['Экран / Дисплей'] = item.screen;
    if (item.cpu) techSpecs['Процессор (CPU)'] = item.cpu;
    if (item.gpu) techSpecs['Графика (GPU)'] = item.gpu;
    if (item.ram) techSpecs['Оперативная память'] = item.ram;
    if (item.ssd || item.storage) techSpecs['Накопитель'] = item.ssd || item.storage;
    if (item.battery) techSpecs['Аккумулятор / Время работы'] = item.battery;
    if (item.switch) techSpecs['Переключатели (Свитчи)'] = item.switch;
    if (item.sensor) techSpecs['Оптический сенсор'] = item.sensor;
    if (item.weight) techSpecs['Вес устройства'] = item.weight;
    if (item.speed) techSpecs['Скорость передачи данных'] = item.speed;
    if (item.type) techSpecs['Тип устройства'] = item.type;
    if (item.conn) techSpecs['Подключение'] = item.conn;
    if (item.power) techSpecs['Мощность'] = item.power;
    if (item.ports) techSpecs['Интерфейсы и порты'] = item.ports;

    if (Object.keys(techSpecs).length > 0) {
      specsObj['Технические параметры'] = techSpecs;
    }

    const tags = [
      cat.name.toLowerCase(),
      cat.slug,
      item.brand.toLowerCase(),
      ...item.title.toLowerCase().split(' ').filter(w => w.length > 2)
    ];

    generatedProducts.push({
      id,
      title: item.title,
      slug: rawSlug,
      brand: item.brand,
      category: cat.name,
      categorySlug: cat.slug,
      price: item.price,
      oldPrice: item.oldPrice,
      discountPercent,
      isTechFriday: idx % 4 === 0,
      isHotDeal: discountPercent ? discountPercent >= 10 : false,
      isNew: idx < 6,
      isBestseller: salesCount > 300,
      salesCount,
      rating,
      reviewsCount,
      mainImage: mainImg,
      gallery,
      colors,
      storageOptions,
      inStock: true,
      stockQuantity: 5 + (idx % 25),
      description: `${item.title} от ведущего производителя ${item.brand}. Идеальное сочетание передовых технологий, высокой надежности и премиального дизайна. Официальная гарантия 1 год, доставка по всему Казахстану и возможность покупки в рассрочку.`,
      specs: specsObj,
      tags: Array.from(new Set(tags)),
      createdAt: '2026-09-01T10:00:00Z'
    });
  });
});

console.log(`Total products generated: ${generatedProducts.length}`);
categoriesConfig.forEach(c => {
  c.productCount = categoryCounts[c.slug] || 0;
  console.log(`- ${c.name} (${c.slug}): ${c.productCount} products`);
});

// Create complete mockData.ts file
const mockDataContent = `import { Category, Product, Order, PromoCode, Review, NotificationItem, TechFridaySettings, User } from '@/types';

export const INITIAL_CATEGORIES: Category[] = ${JSON.stringify(categoriesConfig, null, 2)};

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(generatedProducts, null, 2)};

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'TECHFRIDAY', type: 'fixed', value: 50000, minOrder: 200000, validUntil: '2026-09-30', active: true },
  { code: 'GADGET10', type: 'percent', value: 10, minOrder: 50000, validUntil: '2026-10-15', active: true },
  { code: 'KZSTART', type: 'fixed', value: 10000, minOrder: 30000, validUntil: '2026-12-31', active: true },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'TM-10482',
    createdAt: '2026-09-14T11:20:00Z',
    customerName: 'Иван Сергеев',
    phone: '+7 (777) 123-45-67',
    email: 'ivan@example.kz',
    city: 'Кызылорда',
    street: 'ул. Айтеке би',
    house: '42',
    apartment: '15',
    deliveryMethod: 'Курьер',
    paymentMethod: 'Онлайн-оплата (Kaspi / QR)',
    items: [
      {
        id: 'ord-item-1',
        product: INITIAL_PRODUCTS[1] || INITIAL_PRODUCTS[0],
        selectedColor: 'Серебристый металлик',
        selectedStorage: '512 GB',
        quantity: 1,
        unitPrice: (INITIAL_PRODUCTS[1] || INITIAL_PRODUCTS[0]).price,
      }
    ],
    subtotal: 699990,
    discount: 50000,
    deliveryFee: 0,
    total: 649990,
    status: 'В пути',
    promoCodeApplied: 'TECHFRIDAY',
  },
  {
    id: 'TM-10481',
    createdAt: '2026-09-14T09:15:00Z',
    customerName: 'Али Нургалиев',
    phone: '+7 (701) 987-65-43',
    email: 'ali@example.kz',
    city: 'Кызылорда',
    street: 'пр. Жибек Жолы',
    house: '18',
    deliveryMethod: 'Пункт выдачи',
    paymentMethod: 'Банковская карта',
    items: [
      {
        id: 'ord-item-2',
        product: INITIAL_PRODUCTS[0],
        selectedColor: 'Матовый черный',
        quantity: 1,
        unitPrice: INITIAL_PRODUCTS[0].price,
      }
    ],
    subtotal: INITIAL_PRODUCTS[0].price,
    discount: 0,
    deliveryFee: 0,
    total: INITIAL_PRODUCTS[0].price,
    status: 'Оплачен',
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: INITIAL_PRODUCTS[0].id,
    author: 'Ерлан Садыков',
    rating: 5,
    date: '10 сентября 2026',
    content: 'Заказ пришел очень быстро в Кызылорду! Упаковка надежная, заводские пломбы целые. Товар превзошел все ожидания, качество супер!',
    isVerifiedPurchase: true,
    likes: 24,
  },
  {
    id: 'rev-2',
    productId: INITIAL_PRODUCTS[1].id,
    author: 'Асель К.',
    rating: 5,
    date: '12 сентября 2026',
    content: 'Покупала в рассрочку. Все работает молниеносно, дизайн на высоте. Спасибо магазину TechMarket за качественный сервис!',
    isVerifiedPurchase: true,
    likes: 12,
  },
  {
    id: 'rev-3',
    productId: INITIAL_PRODUCTS[2].id,
    author: 'Нурсултан',
    rating: 5,
    date: '8 сентября 2026',
    content: 'Отличная модель, пользуюсь каждый день. Радует автономность и надежность сборки.',
    isVerifiedPurchase: true,
    likes: 35,
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Цена снизилась!',
    message: 'Цена на избранный товар снизилась. Успейте оформить заказ по выгодной цене!',
    type: 'price_drop',
    date: '14.09.2026 10:00',
    isRead: false,
    link: '/catalog',
  },
  {
    id: 'notif-2',
    title: 'Заказ передан курьеру',
    message: 'Ваш заказ #TM-10482 передан курьеру и будет доставлен сегодня до 19:00.',
    type: 'order',
    date: '14.09.2026 09:30',
    isRead: false,
    link: '/profile',
  },
  {
    id: 'notif-3',
    title: '🔥 Акция TECH FRIDAY',
    message: 'TECH FRIDAY в самом разгаре! Скидки до 30% на все гаджеты и электронику.',
    type: 'promo',
    date: '13.09.2026 14:00',
    isRead: true,
  }
];

export const INITIAL_USER: User = {
  id: 'usr-lawliet',
  name: 'Lawliet (Анель)',
  email: 'lawliet@techmarket.kz',
  phone: '+7 (777) 900-11-22',
  role: 'ADMIN',
  registeredAt: '2025-11-10',
  ordersCount: 3,
  totalSpent: 1279980,
  addresses: [
    { city: 'Кызылорда', address: 'ул. Айтеке би, дом 42, кв 15', isDefault: true },
    { city: 'Кызылорда', address: 'пр. Абая, дом 10, офис 301', isDefault: false },
  ]
};

export const INITIAL_TECH_FRIDAY: TechFridaySettings = {
  title: 'TECH FRIDAY',
  isActive: true,
  endDate: new Date(Date.now() + 3 * 86400000 + 21 * 3600000 + 47 * 60000 + 12000).toISOString(),
  discountRange: '10–30%',
};
`;

fs.writeFileSync(targetPath, mockDataContent, 'utf-8');
console.log('Successfully wrote expanded catalog to', targetPath);

// Generate PostgreSQL seed SQL
const sqlPath = path.join(__dirname, '../init-db/02-seed-expanded.sql');
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

const sqlLines = [];
sqlLines.push('-- Expanded 700+ Products Seed');
sqlLines.push('BEGIN;');
sqlLines.push('TRUNCATE TABLE product_specifications, product_images, product_colors, product_storage_options, order_items, cart_items, reviews, favorites, product_comparisons, products CASCADE;');

const brandsSet = new Set();
generatedProducts.forEach(p => {
  if (p.brand) brandsSet.add(p.brand);
});

Array.from(brandsSet).forEach(b => {
  const bSlug = slugify(b) || b.toLowerCase();
  sqlLines.push(`INSERT INTO brands (name, slug) VALUES (${escapeSql(b)}, ${escapeSql(bSlug)}) ON CONFLICT (name) DO NOTHING;`);
});

categoriesConfig.forEach(c => {
  sqlLines.push(`INSERT INTO categories (name, slug, icon, product_count, is_popular)
VALUES (${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.icon)}, ${c.productCount}, ${c.isPopular ? 'TRUE' : 'FALSE'})
ON CONFLICT (slug) DO UPDATE SET product_count = ${c.productCount}, is_popular = ${c.isPopular ? 'TRUE' : 'FALSE'};`);
});

generatedProducts.forEach(p => {
  const brandSub = `(SELECT id FROM brands WHERE name = ${escapeSql(p.brand)} LIMIT 1)`;
  const catSub = `(SELECT id FROM categories WHERE slug = ${escapeSql(p.categorySlug)} LIMIT 1)`;

  sqlLines.push(`INSERT INTO products (
    id, title, slug, brand_id, category_id, price, old_price, discount_percent,
    is_tech_friday, is_hot_deal, is_new, is_bestseller, sales_count, rating, reviews_count,
    main_image, in_stock, stock_quantity, description
  ) VALUES (
    ${escapeSql(p.id)},
    ${escapeSql(p.title)},
    ${escapeSql(p.id.replace('prod-', ''))},
    ${brandSub},
    ${catSub},
    ${p.price},
    ${p.oldPrice ? p.oldPrice : 'NULL'},
    ${p.discountPercent || 0},
    ${p.isTechFriday ? 'TRUE' : 'FALSE'},
    ${p.isHotDeal ? 'TRUE' : 'FALSE'},
    ${p.isNew ? 'TRUE' : 'FALSE'},
    ${p.isBestseller ? 'TRUE' : 'FALSE'},
    ${p.salesCount || 0},
    ${p.rating || 5.0},
    ${p.reviewsCount || 0},
    ${escapeSql(p.mainImage)},
    ${p.inStock ? 'TRUE' : 'FALSE'},
    ${p.stockQuantity || 10},
    ${escapeSql(p.description)}
  );`);

  if (p.gallery && p.gallery.length > 0) {
    p.gallery.forEach((img, gIdx) => {
      sqlLines.push(`INSERT INTO product_images (product_id, image_url, sort_order) VALUES (${escapeSql(p.id)}, ${escapeSql(img)}, ${gIdx});`);
    });
  }

  if (p.colors && p.colors.length > 0) {
    p.colors.forEach(col => {
      sqlLines.push(`INSERT INTO product_colors (product_id, color_name, hex_code, in_stock) VALUES (${escapeSql(p.id)}, ${escapeSql(col.name)}, ${escapeSql(col.hex)}, ${col.inStock ? 'TRUE' : 'FALSE'});`);
    });
  }

  if (p.storageOptions && p.storageOptions.length > 0) {
    p.storageOptions.forEach(opt => {
      sqlLines.push(`INSERT INTO product_storage_options (product_id, capacity, price_offset) VALUES (${escapeSql(p.id)}, ${escapeSql(opt.capacity)}, ${opt.priceOffset});`);
    });
  }
});

sqlLines.push('COMMIT;');
fs.writeFileSync(sqlPath, sqlLines.join('\n'), 'utf-8');
console.log('Successfully wrote PostgreSQL SQL seed to', sqlPath);

