-- ==============================================================================
-- TechMarket PostgreSQL Database Initialization Script
-- Comprehensive schema and realistic seed data for electronics marketplace
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean tables if exists
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS product_specifications CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_colors CASCADE;
DROP TABLE IF EXISTS product_storage_options CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS product_comparisons CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. ROLES & USERS
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES 
('ROLE_USER'),
('ROLE_ADMIN'),
('ROLE_MANAGER');

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES & BRANDS
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(20),
    product_count INT DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    description TEXT
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_symbol VARCHAR(20)
);

-- 3. PRODUCTS
CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand_id INT REFERENCES brands(id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    price INT NOT NULL,
    old_price INT,
    discount_percent INT DEFAULT 0,
    is_tech_friday BOOLEAN DEFAULT FALSE,
    is_hot_deal BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    sales_count INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    main_image VARCHAR(500) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 10,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_sales ON products(sales_count DESC);

-- 4. PRODUCT ATTRIBUTES & SPECS
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE product_colors (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    color_name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(10) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE
);

CREATE TABLE product_storage_options (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    capacity VARCHAR(50) NOT NULL,
    price_offset INT DEFAULT 0
);

CREATE TABLE product_specifications (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    group_name VARCHAR(100) NOT NULL,
    param_name VARCHAR(100) NOT NULL,
    param_value TEXT NOT NULL
);

-- 5. CART
CREATE TABLE carts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id VARCHAR(128) PRIMARY KEY,
    cart_id VARCHAR(64) REFERENCES carts(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    selected_color VARCHAR(100),
    selected_storage VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1,
    unit_price INT NOT NULL
);

-- 6. FAVORITES & COMPARISONS
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE product_comparisons (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 7. ORDERS & ORDER ITEMS
CREATE TABLE orders (
    id VARCHAR(32) PRIMARY KEY, -- e.g. "TM-10482"
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street VARCHAR(150) NOT NULL,
    house VARCHAR(50) NOT NULL,
    apartment VARCHAR(50),
    delivery_method VARCHAR(50) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    subtotal INT NOT NULL,
    discount INT DEFAULT 0,
    delivery_fee INT DEFAULT 0,
    total INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Оплачен',
    promo_code_applied VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(32) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    selected_color VARCHAR(100),
    selected_storage VARCHAR(50),
    quantity INT NOT NULL,
    unit_price INT NOT NULL,
    total_price INT NOT NULL
);

-- 8. REVIEWS
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    likes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. PROMOTIONS & PROMO CODES
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'fixed' or 'percent'
    value INT NOT NULL,
    min_order INT DEFAULT 0,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    discount_range VARCHAR(50) NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 10. NOTIFICATIONS
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Users
INSERT INTO users (id, name, email, password_hash, phone) VALUES
('usr-lawliet', 'Lawliet (Анель)', 'lawliet@techmarket.kz', '$2a$12$e8Y6e59B51p95W4UqK6B2O6F1L6aM9pA9qR8fS4uT7vW0xY1zA2B3', '+7 (777) 900-11-22'),
('usr-ivan', 'Иван Сергеев', 'ivan@example.kz', '$2a$12$e8Y6e59B51p95W4UqK6B2O6F1L6aM9pA9qR8fS4uT7vW0xY1zA2B3', '+7 (777) 123-45-67'),
('usr-ali', 'Али Нургалиев', 'ali@example.kz', '$2a$12$e8Y6e59B51p95W4UqK6B2O6F1L6aM9pA9qR8fS4uT7vW0xY1zA2B3', '+7 (701) 987-65-43');

-- Seed Roles for Users
INSERT INTO user_roles (user_id, role_id) VALUES
('usr-lawliet', 2), -- ADMIN
('usr-ivan', 1),    -- USER
('usr-ali', 1);     -- USER

-- Seed Addresses
INSERT INTO addresses (user_id, city, address_line, is_default) VALUES
('usr-lawliet', 'Кызылорда', 'ул. Айтеке би, дом 42, кв 15', TRUE),
('usr-ivan', 'Кызылорда', 'ул. Айтеке би, дом 42, кв 15', TRUE),
('usr-ali', 'Кызылорда', 'пр. Жибек Жолы, дом 18', TRUE);

-- Seed Categories (22 categories as in TZ)
INSERT INTO categories (name, slug, icon, product_count, is_popular) VALUES
('Смартфоны', 'smartphones', '📱', 248, TRUE),
('Ноутбуки', 'laptops', '💻', 164, TRUE),
('Персональные ПК', 'pc', '🖥', 82, TRUE),
('Игровые консоли', 'gaming-consoles', '🎮', 45, TRUE),
('Планшеты', 'tablets', '📱', 96, FALSE),
('iPad', 'ipad', '🍎', 54, TRUE),
('Наушники', 'headphones', '🎧', 312, TRUE),
('Смарт-часы', 'smart-watches', '⌚', 180, TRUE),
('Электронные книги', 'ebooks', '📖', 38, FALSE),
('Мониторы', 'monitors', '🖥', 120, TRUE),
('Клавиатуры', 'keyboards', '⌨️', 145, FALSE),
('Мыши', 'mice', '🖱', 172, FALSE),
('Микрофоны', 'microphones', '🎤', 65, FALSE),
('Камеры', 'cameras', '📷', 48, FALSE),
('Зарядные устройства', 'chargers', '🔌', 210, FALSE),
('Power Bank', 'powerbanks', '🔋', 134, FALSE),
('Принтеры', 'printers', '🖨', 56, FALSE),
('Телевизоры', 'tv', '📺', 92, TRUE),
('Сетевое оборудование', 'networking', '🌐', 78, FALSE),
('SSD / HDD / флешки', 'storage-devices', '💾', 195, FALSE),
('Комплектующие для ПК', 'components', '🧩', 340, FALSE),
('Аксессуары', 'accessories', '🎒', 410, FALSE);

-- Seed Brands
INSERT INTO brands (name, slug, logo_symbol) VALUES
('Apple', 'apple', '🍎'),
('Samsung', 'samsung', '🪐'),
('Sony', 'sony', '🎵'),
('Lenovo', 'lenovo', '💻'),
('ASUS', 'asus', '⚡'),
('LG', 'lg', '📺'),
('Logitech', 'logitech', '🖱');

-- Seed Products
INSERT INTO products (id, title, slug, brand_id, category_id, price, old_price, discount_percent, is_tech_friday, is_hot_deal, is_new, is_bestseller, sales_count, rating, reviews_count, main_image, in_stock, stock_quantity, description) VALUES
('prod-iphone-17-pro', 'Apple iPhone 17 Pro', 'apple-iphone-17-pro', 1, 1, 599990, 649990, 8, TRUE, TRUE, TRUE, TRUE, 842, 4.90, 124, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop', TRUE, 42, 'Флагман нового поколения с чипом A19 Pro, титановым корпусом аэрокосмического класса и камерой 10x зум.'),
('prod-macbook-air-m4', 'Apple MacBook Air 15" M4', 'apple-macbook-air-15-m4', 1, 2, 699990, 749990, 7, TRUE, TRUE, TRUE, TRUE, 654, 4.90, 127, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop', TRUE, 28, 'Тонкий и быстрый MacBook Air на процессоре M4. До 20 часов автономной работы и экран Liquid Retina 15.3".'),
('prod-samsung-s25-ultra', 'Samsung Galaxy S25 Ultra 5G', 'samsung-galaxy-s25-ultra', 2, 1, 629990, 699990, 10, TRUE, TRUE, TRUE, TRUE, 512, 4.85, 98, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop', TRUE, 34, 'Ультимативный флагман со стилусом S-Pen, 200 Мп камерой и искусственным интеллектом Galaxy AI.'),
('prod-airpods-pro-2', 'Apple AirPods Pro 2 (USB-C)', 'apple-airpods-pro-2-usb-c', 1, 7, 129990, 149990, 13, TRUE, TRUE, FALSE, TRUE, 1420, 4.95, 310, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop', TRUE, 110, 'TWS-наушники с адаптивным шумоподавлением, кейсом MagSafe USB-C и чипом H2.'),
('prod-lenovo-legion-pro-5', 'Игровой ноутбук Lenovo Legion Pro 5 16"', 'lenovo-legion-pro-5-16', 4, 2, 849990, 929990, 9, FALSE, TRUE, TRUE, TRUE, 280, 4.88, 76, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop', TRUE, 19, 'Идеален для Java/Spring Boot, Docker и AAA-гейминга: Intel Core i9-14900HX, RTX 4070 8GB, 32 GB DDR5.'),
('prod-sony-wh1000xm5', 'Беспроводные наушники Sony WH-1000XM5', 'sony-wh-1000xm5', 3, 7, 169990, 199990, 15, TRUE, TRUE, FALSE, FALSE, 430, 4.82, 89, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop', TRUE, 24, 'Эталонное шумоподавление с 8 микрофонами, поддержка LDAC и до 30 часов автономной работы.'),
('prod-playstation-5-pro', 'Игровая консоль Sony PlayStation 5 Pro 2TB', 'sony-playstation-5-pro-2tb', 3, 4, 459990, 499990, 8, FALSE, TRUE, TRUE, TRUE, 780, 4.96, 160, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop', TRUE, 21, 'Мощная консоль нового поколения с AI-апскейлером PSSR и накопителем 2 ТБ SSD.');

-- Seed Promo Codes
INSERT INTO promo_codes (code, type, value, min_order, valid_until, is_active) VALUES
('TECHFRIDAY', 'fixed', 15000, 100000, '2026-10-31', TRUE),
('TECH20', 'percent', 20, 50000, '2026-10-31', TRUE),
('NEWBIE', 'fixed', 10000, 70000, '2026-12-31', TRUE);

-- Seed Orders
INSERT INTO orders (id, user_id, customer_name, phone, email, city, street, house, apartment, delivery_method, payment_method, subtotal, discount, delivery_fee, total, status, promo_code_applied) VALUES
('TM-10482', 'usr-ivan', 'Иван Сергеев', '+7 (777) 123-45-67', 'ivan@example.kz', 'Кызылорда', 'ул. Айтеке би', '42', '15', 'Курьер', 'Онлайн-оплата (Kaspi / QR)', 749990, 50000, 0, 699990, 'В пути', 'TECHFRIDAY'),
('TM-10481', 'usr-ali', 'Али Нургалиев', '+7 (701) 987-65-43', 'ali@example.kz', 'Кызылорда', 'пр. Жибек Жолы', '18', '', 'Пункт выдачи', 'Банковская карта', 149990, 20000, 0, 129990, 'Оплачен', NULL),
('TM-10480', 'usr-lawliet', 'Данияр Ахметов', '+7 (705) 555-12-34', 'daniyar@example.kz', 'Кызылорда', 'ул. Байтурсынова', '88', '4', 'Курьер', 'Оплата при получении', 499990, 49990, 0, 450000, 'Доставлен', NULL);

-- Seed Order Items
INSERT INTO order_items (order_id, product_id, product_title, selected_color, selected_storage, quantity, unit_price, total_price) VALUES
('TM-10482', 'prod-macbook-air-m4', 'Apple MacBook Air 15" M4', 'Темная полночь', '512 GB SSD', 1, 699990, 699990),
('TM-10481', 'prod-airpods-pro-2', 'Apple AirPods Pro 2 (USB-C)', 'Белый глянец', '', 1, 129990, 129990),
('TM-10480', 'prod-playstation-5-pro', 'Sony PlayStation 5 Pro 2TB', 'Белый / Черный', '2 TB SSD', 1, 450000, 450000);

-- Seed Promotions
INSERT INTO promotions (title, discount_range, starts_at, ends_at, is_active) VALUES
('TECH FRIDAY', '10–30%', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '4 days', TRUE);
