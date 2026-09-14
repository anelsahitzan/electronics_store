const fs = require('fs');
const path = require('path');

// Read compiled products from mockData.ts or require compiled data
const { INITIAL_CATEGORIES, INITIAL_PRODUCTS } = require('../src/data/mockData.ts');

const outputPath = path.join(__dirname, '../init-db/02-seed-expanded.sql');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

const sqlLines = [];
sqlLines.push('-- Expanded 700+ Products Seed');
sqlLines.push('BEGIN;');

// Clear existing products and related tables
sqlLines.push('TRUNCATE TABLE product_specifications, product_images, product_colors, product_storage_options, order_items, cart_items, reviews, favorites, product_comparisons, products CASCADE;');

// Ensure brands exist
const brandsSet = new Set();
INITIAL_PRODUCTS.forEach(p => {
  if (p.brand) brandsSet.add(p.brand);
});

sqlLines.push('-- Seed Brands');
Array.from(brandsSet).forEach(b => {
  const slug = b.toLowerCase().replace(/[^\w]/g, '-');
  sqlLines.push(`INSERT INTO brands (name, slug) VALUES (${escapeSql(b)}, ${escapeSql(slug)}) ON CONFLICT (name) DO NOTHING;`);
});

// Seed Categories
sqlLines.push('-- Seed / Update Categories');
INITIAL_CATEGORIES.forEach(c => {
  sqlLines.push(`INSERT INTO categories (name, slug, icon, product_count, is_popular)
VALUES (${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.icon)}, ${c.productCount}, ${c.isPopular ? 'TRUE' : 'FALSE'})
ON CONFLICT (slug) DO UPDATE SET product_count = ${c.productCount}, is_popular = ${c.isPopular ? 'TRUE' : 'FALSE'};`);
});

// Seed Products
sqlLines.push('-- Seed Products');
INITIAL_PRODUCTS.forEach(p => {
  const brandSub = `(SELECT id FROM brands WHERE name = ${escapeSql(p.brand)} LIMIT 1)`;
  const catSub = `(SELECT id FROM categories WHERE slug = ${escapeSql(p.categorySlug)} LIMIT 1)`;

  sqlLines.push(`INSERT INTO products (
    id, title, slug, brand_id, category_id, price, old_price, discount_percent,
    is_tech_friday, is_hot_deal, is_new, is_bestseller, sales_count, rating, reviews_count,
    main_image, in_stock, stock_quantity, description
  ) VALUES (
    ${escapeSql(p.id)},
    ${escapeSql(p.title)},
    ${escapeSql(p.slug + '-' + p.id.slice(-6))},
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

  // Images
  if (p.gallery && p.gallery.length > 0) {
    p.gallery.forEach((img, gIdx) => {
      sqlLines.push(`INSERT INTO product_images (product_id, image_url, is_main, sort_order) VALUES (${escapeSql(p.id)}, ${escapeSql(img)}, ${gIdx === 0 ? 'TRUE' : 'FALSE'}, ${gIdx});`);
    });
  }

  // Colors
  if (p.colors && p.colors.length > 0) {
    p.colors.forEach(col => {
      sqlLines.push(`INSERT INTO product_colors (product_id, name, hex_code, in_stock) VALUES (${escapeSql(p.id)}, ${escapeSql(col.name)}, ${escapeSql(col.hex)}, ${col.inStock ? 'TRUE' : 'FALSE'});`);
    });
  }

  // Storage
  if (p.storageOptions && p.storageOptions.length > 0) {
    p.storageOptions.forEach(opt => {
      sqlLines.push(`INSERT INTO product_storage_options (product_id, capacity, price_offset) VALUES (${escapeSql(p.id)}, ${escapeSql(opt.capacity)}, ${opt.priceOffset});`);
    });
  }
});

sqlLines.push('COMMIT;');

fs.writeFileSync(outputPath, sqlLines.join('\n'), 'utf-8');
console.log(`Generated SQL seed file with ${INITIAL_PRODUCTS.length} products at ${outputPath}`);
