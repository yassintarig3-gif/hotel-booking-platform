DROP DATABASE IF EXISTS tarig_db;

CREATE DATABASE tarig_db;

USE tarig_db;


-- =========================
-- USERS
-- =========================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- HOTELS
-- =========================

CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    image VARCHAR(500) NOT NULL
);


-- =========================
-- BOOKINGS
-- =========================

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    hotel_id INT NOT NULL,

    hotel_name VARCHAR(150) NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL,

    phone VARCHAR(30),

    guests INT NOT NULL,

    check_in DATE NOT NULL,

    check_out DATE NOT NULL,

    nights INT NOT NULL,

    total_price DECIMAL(12,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (hotel_id)
        REFERENCES hotels(id)
        ON DELETE CASCADE
);


-- =========================
-- HOTELS DATA
-- =========================

INSERT INTO hotels
(name, city, rating, price, image)
VALUES

(
    'Gedaref Grand Hotel',
    'Gedaref, Sudan',
    4.8,
    250000,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
),

(
    'Gedaref Palace Hotel',
    'Gedaref, Sudan',
    4.6,
    180000,
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80'
),

(
    'TARIG Royal Hotel',
    'Gedaref, Sudan',
    4.9,
    300000,
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
);