-- This file is used to initialize the database schema when the container is started
-- It is executed by the Dockerfile when the container is built
-- It creates the tables for the users, categories, items, reviews and comments

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS notifications_folders;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

-- User table
-- The user table stores information about the users of the application
-- It includes fields for the user's name, email, password, active status, last login time and creation date
-- The email field is unique to ensure that each user has a unique email address
-- The active field is a boolean that indicates whether the user is active or not
-- The last login field stores the timestamp of the user's last login
-- The date created field stores the timestamp of when the user account was created
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "emailVerified" BOOLEAN DEFAULT FALSE,
    "image" TEXT,
    isAdmin BOOLEAN DEFAULT FALSE,
);

-- Account table
-- The account table stores information about the user's external accounts (e.g. Google, Facebook, etc.)
CREATE TABLE IF NOT EXISTS accounts
(
    id SERIAL PRIMARY KEY,
    "userId" integer NOT NULL,
    type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    provider character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "providerAccountId" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    refresh_token text COLLATE pg_catalog."default",
    access_token text COLLATE pg_catalog."default",
    expires_at bigint,
    id_token text COLLATE pg_catalog."default",
    scope text COLLATE pg_catalog."default",
    session_state text COLLATE pg_catalog."default",
    token_type text COLLATE pg_catalog."default"
);

-- Category table
-- The category table stores information about the categories of items in the application
-- It includes fields for the category name and a description template
-- The description template field is a JSON object that will store form fields for the item description
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    slug VARCHAR(100) UNIQUE,
    description_template jsonb -- Description de l'item (peut être un objet JSON)
);

-- Item table
-- The item table stores information about the items in the application
-- It includes fields for the item name, category ID, description and creation date
-- The category ID field is a reference to the category of the item
-- The description field is a JSON object that will store the item description
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    slug VARCHAR(100) UNIQUE,
    category_id INT, -- Référence vers la catégorie de l'item
    description jsonb, -- Description de l'item (peut être un objet JSON)
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Review table
-- The review table stores information about the reviews of items in the application
-- It includes fields for the user ID, item ID, rating, content, likes and creation date
-- The user ID field is a reference to the user who created the review
-- The item ID field is a reference to the item being reviewed
-- The rating field stores the rating of the review (e.g. a score out of 5 or 10)
-- The content field stores the text content of the review
-- The likes field stores the number of likes the review has received
-- The date created field stores the timestamp of when the review was created
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INT, -- User who wrote the review
    item_id INT, -- Item being reviewed
    title VARCHAR(100), -- Title of the review
    content TEXT, -- Content of the review
    rating INT, -- Rating of the review
    likes INT DEFAULT 0, -- Number of likes, default to 0
    dislikes INT DEFAULT 0, -- Number of dislikes, default to 0
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date the review was created
);

-- Comment table
-- The comment table stores information about the comments on reviews in the application
-- It includes fields for the user ID, review ID, content, likes and creation date
-- The user ID field is a reference to the user who created the comment
-- The review ID field is a reference to the review being commented
-- The content field stores the text content of the comment
-- The likes field stores the number of likes the comment has received
-- The date created field stores the timestamp of when the comment was created
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INT, -- User who wrote the comment
    review_id INT, -- Review being commented
    content TEXT, -- Content of the comment
    likes INT DEFAULT 0, -- Number of likes, default to 0
    dislikes INT DEFAULT 0, -- Number of dislikes, default to 0
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications folders table
-- The notifications_folders table stores information about user-specific notification folders
-- It includes fields for the user ID, folder name, type and creation date
-- The user ID field is a reference to the user who owns the folder
-- The folder name field stores the name of the folder
-- The type field stores the type of the folder (e.g. system, user)
-- The creation date field stores the timestamp of when the folder was created
CREATE TABLE IF NOT EXISTS notifications_folders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'system', -- 'system', 'user'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
-- The notifications table stores information about notifications sent to users
-- It includes fields for the user ID, message, sent date and hidden status
-- The user ID field is a reference to the user who received the notification
-- The message field stores the text content of the notification
-- The sent date field stores the timestamp of when the notification was sent
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'unread', -- 'read', 'unread'
  type VARCHAR(20) NOT NULL DEFAULT 'system', -- 'system', 'user'
  folder_id INTEGER REFERENCES notifications_folders(id),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Truncate tables and reset identities
TRUNCATE TABLE comments RESTART IDENTITY CASCADE;
TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE items RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;
TRUNCATE TABLE notifications_folders RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Inserting users
INSERT INTO users (name, email, password) VALUES 
('SAR Admin', '', ''),
('Amelia Earhart', 'amelia@example.com', 'admin'),
('Christopher Columbus', 'columbus@example.com', 'password1'),
('Marco Polo', 'polo@example.com', 'password2'),
('Vasco da Gama', 'gama@example.com', 'password3'),
('Ferdinand Magellan', 'magellan@example.com', 'password4'),
('Leif Erikson', 'leif@example.com', 'password5'),
('Zheng He', 'zheng@example.com', 'password6'),
('Ibn Battuta', 'ibn@example.com', 'password7'),
('Hernan Cortes', 'cortes@example.com', 'password8'),
('James Cook', 'cook@example.com', 'password9'),
('Roald Amundsen', 'amundsen@example.com', 'password10'),
('Neil Armstrong', 'neil@example.com', 'password11'),
('Yuri Gagarin', 'yuri@example.com', 'password12'),
('Buzz Aldrin', 'buzz@example.com', 'password13'),
('Sally Ride', 'sally@example.com', 'password14'),
('Valentina Tereshkova', 'valentina@example.com', 'password15'),
('Alan Shepard', 'alan@example.com', 'password16'),
('John Glenn', 'john@example.com', 'password17'),
('Gherman Titov', 'gher@example.com', 'password18'),
('Alexei Leonov', 'alexei@example.com', 'password19');

-- Inserting categories
INSERT INTO categories (name, slug, description_template) VALUES 
('Electronics', 'electronics', '{"name": "text","brand": "text", "model": "text", "price": "number", "color": "text"}'),
('Movies', 'movies', '{"name": "text","title": "text", "director": "text", "year": "number", "genre": "text"}'),
('Restaurants', 'restaurants', '{"name": "text", "cuisine": "text", "location": "text", "rating": "number"}');

-- Inserting items into Electronics category
INSERT INTO items (name, slug, category_id, description) VALUES 
('iPhone 12', 'iphone-12', 1, '{"brand": "Apple", "model": "iPhone 12", "price": 799, "color": "Black"}'),
('Galaxy S21', 'galaxy-s21', 1, '{"brand": "Samsung", "model": "Galaxy S21", "price": 799, "color": "Phantom Gray"}'),
('Pixel 5', 'pixel-5', 1, '{"brand": "Google", "model": "Pixel 5", "price": 699, "color": "Just Black"}'),
('OnePlus 8T', 'oneplus-8t', 1, '{"brand": "OnePlus", "model": "8T", "price": 749, "color": "Aquamarine Green"}'),
('Sony WH-1000XM4', 'sony-wh-1000xm4', 1, '{"brand": "Sony", "model": "WH-1000XM4", "price": 349, "color": "Silver"}'),
('Dell XPS 13', 'dell-xps-13', 1, '{"brand": "Dell", "model": "XPS 13", "price": 999, "color": "White"}'),
('MacBook Pro', 'macbook-pro', 1, '{"brand": "Apple", "model": "MacBook Pro", "price": 1299, "color": "Space Gray"}'),
('Surface Pro 7', 'surface-pro-7', 1, '{"brand": "Microsoft", "model": "Surface Pro 7", "price": 749, "color": "Black"}');

-- Inserting items into Movies category
INSERT INTO items (name, slug, category_id, description) VALUES
('Inception', 'inception', 2, '{"title": "Inception", "director": "Christopher Nolan", "year": 2010, "genre": "Sci-Fi"}'),
('The Matrix', 'the-matrix', 2, '{"title": "The Matrix", "director": "Lana Wachowski, Lilly Wachowski", "year": 1999, "genre": "Action"}'),
('Interstellar', 'interstellar', 2, '{"title": "Interstellar", "director": "Christopher Nolan", "year": 2014, "genre": "Sci-Fi"}'),
('Parasite', 'parasite' ,2, '{"title": "Parasite", "director": "Bong Joon Ho", "year": 2019, "genre": "Thriller"}'),
('Pulp Fiction', 'pulp-fiction', 2, '{"title": "Pulp Fiction", "director": "Quentin Tarantino", "year": 1994, "genre": "Crime"}'),
('The Godfather', 'the-godfather', 2, '{"title": "The Godfather", "director": "Francis Ford Coppola", "year": 1972, "genre": "Crime"}'),
('The Dark Knight', 'the-dark-knight', 2, '{"title": "The Dark Knight", "director": "Christopher Nolan", "year": 2008, "genre": "Action"}'),
('Forrest Gump', 'forrest-gump', 2, '{"title": "Forrest Gump", "director": "Robert Zemeckis", "year": 1994, "genre": "Drama"}');

-- Inserting items into Restaurants category
INSERT INTO items (name, slug, category_id, description) VALUES 
('Joe''s Pizza', 'joes-pizza', 3, '{"name": "Joe''s Pizza", "cuisine": "Italian", "location": "New York, NY", "rating": 4.5}'),
('Sushi Nakazawa', 'sushi-nakazawa', 3, '{"name": "Sushi Nakazawa", "cuisine": "Japanese", "location": "New York, NY", "rating": 4.8}'),
('The French Laundry', 'the-french-laundry', 3, '{"name": "The French Laundry", "cuisine": "French", "location": "Yountville, CA", "rating": 4.9}'),
('Noma', 'noma', 3, '{"name": "Noma", "cuisine": "Nordic", "location": "Copenhagen, Denmark", "rating": 4.7}'),
('Osteria Francescana', 'osteria-francescana', 3, '{"name": "Osteria Francescana", "cuisine": "Italian", "location": "Modena, Italy", "rating": 4.8}'),
('El Celler de Can Roca', 'el-celler-de-can-roca', 3, '{"name": "El Celler de Can Roca", "cuisine": "Spanish", "location": "Girona, Spain", "rating": 4.9}'),
('Mugaritz', 'mugaritz', 3, '{"name": "Mugaritz", "cuisine": "Spanish", "location": "Errenteria, Spain", "rating": 4.7}'),
('Steirereck', 'steirereck', 3, '{"name": "Steirereck", "cuisine": "Austrian", "location": "Vienna, Austria", "rating": 4.6}');

-- Inserting reviews
INSERT INTO reviews (user_id, item_id, rating, content, likes, dislikes) VALUES 
(1, 1, 5, 'Great phone, love the camera quality!', 25, 5),  -- Review ID 1
(2, 1, 3, 'Solid performance, but a bit pricey.', 15, 8),   -- Review ID 2
(3, 2, 5, 'Best Android phone out there!', 30, 2),         -- Review ID 3
(4, 3, 2, 'Good phone, but battery life could be better.', 10, 20), -- Review ID 4
(5, 4, 4, 'Fast and responsive, great value for money.', 18, 3), -- Review ID 5
(6, 5, 0, 'Did not enjoy this movie at all.', 8, 25),  -- Review ID 6
(7, 5, 4, 'Complex plot, but worth the watch.', 12, 9),   -- Review ID 7
(8, 6, 5, 'Revolutionary movie, a must-watch!', 35, 1),  -- Review ID 8
(9, 7, 5, 'Amazing storyline and visuals.', 40, 0),     -- Review ID 9
(10, 8, 2, 'Did not live up to the hype.', 5, 22), -- Review ID 10
(11, 9, 4, 'Timeless classic, highly recommend.', 28, 4), -- Review ID 11
(12, 10, 5, 'A masterpiece of storytelling.', 45, 3), -- Review ID 12
(13, 11, 4, 'Great acting and direction.', 25, 5), -- Review ID 13
(14, 12, 5, 'An emotional journey.', 35, 7), -- Review ID 14
(15, 13, 3, 'Interesting plot but slow pacing.', 15, 12), -- Review ID 15
(16, 14, 4, 'Well-made movie with great visuals.', 20, 5), -- Review ID 16
(17, 15, 2, 'Not my cup of tea.', 10, 30), -- Review ID 17
(18, 16, 5, 'A pioneer in the genre.', 50, 2), -- Review ID 18
(19, 17, 4, 'Great atmosphere and storytelling.', 35, 5), -- Review ID 19
(20, 18, 5, 'An all-time favorite.', 60, 3), -- Review ID 20
(1, 19, 4, 'Delicious pizza, will visit again.', 22, 3), -- Review ID 21
(2, 20, 5, 'Outstanding sushi, highly recommend.', 30, 1), -- Review ID 22
(3, 21, 5, 'A dining experience like no other.', 45, 2), -- Review ID 23
(4, 22, 3, 'Good food but overpriced.', 12, 10), -- Review ID 24
(5, 23, 4, 'Amazing dishes and atmosphere.', 25, 4), -- Review ID 25
(6, 24, 5, 'The best restaurant I have ever been to.', 50, 2), -- Review ID 26
(7, 25, 4, 'Unique and delicious.', 22, 3), -- Review ID 27
(8, 26, 3, 'Good but not great.', 15, 12), -- Review ID 28
(9, 27, 5, 'Fantastic experience, highly recommend.', 40, 5), -- Review ID 29
(10, 28, 4, 'Great food, will visit again.', 25, 4); -- Review ID 30

-- Inserting comments for reviews 1-10
INSERT INTO comments (user_id, review_id, content, likes, dislikes) 
SELECT 
    u.id, 
    r.id, 
    CASE 
        WHEN r.rating <= 2 THEN 
            CASE ROUND(RANDOM() * 3)
                WHEN 0 THEN 'I completely disagree.'
                WHEN 1 THEN 'This review misses the mark.'
                WHEN 2 THEN 'I strongly disagree with this review.'
                ELSE 'I completely disagree, the product/service is excellent.'
            END
        WHEN r.rating >= 4 THEN 
            CASE ROUND(RANDOM() * 3)
                WHEN 0 THEN 'I agree, great review!'
                WHEN 1 THEN 'Great insights.'
                WHEN 2 THEN 'Spot on review.'
                ELSE 'Couldn''t agree more.'
            END
        ELSE 
            CASE ROUND(RANDOM() * 3)
                WHEN 0 THEN 'I have mixed feelings about this.'
                WHEN 1 THEN 'I''m undecided about this review.'
                WHEN 2 THEN 'This review is hard to judge.'
                ELSE 'I have mixed feelings about this, but it''s helpful.'
            END
    END AS content,
    FLOOR(RANDOM() * 50) AS likes,
    FLOOR(RANDOM() * 50) AS dislikes
FROM 
    reviews r
JOIN 
    users u ON r.user_id != u.id
WHERE 
    (SELECT COUNT(*) FROM comments WHERE review_id = r.id) < 3
LIMIT 
    10;
