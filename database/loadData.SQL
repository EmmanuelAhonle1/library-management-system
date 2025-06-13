-- Sample Data for Library Management System
-- ==============================================
-- This script inserts sample librarians, clients, and 5 library items

-- Insert sample librarians first (needed for foreign key references)
INSERT INTO librarians (librarian_id, first_name, last_name, email, password, is_active, created_date) VALUES
('lib-123456', 'Sarah', 'Johnson', 'sarah.johnson@library.com', '$2b$12$hashed_password_here', TRUE, CURRENT_TIMESTAMP),
('admin-789012', 'Michael', 'Chen', 'michael.chen@library.com', '$2b$12$hashed_password_here', TRUE, CURRENT_TIMESTAMP);

-- Insert sample clients
INSERT INTO clients (client_id, first_name, last_name, email, password, is_active, created_date) VALUES
('usr-100001', 'Emily', 'Rodriguez', 'emily.rodriguez@email.com', '$2b$12$hashed_password_here', TRUE, CURRENT_TIMESTAMP),
('usr-100002', 'James', 'Wilson', 'james.wilson@email.com', '$2b$12$hashed_password_here', TRUE, CURRENT_TIMESTAMP),
('usr-100003', 'Maria', 'Garcia', 'maria.garcia@email.com', '$2b$12$hashed_password_here', TRUE, CURRENT_TIMESTAMP),
('usr-100004', 'David', 'Thompson', 'david.thompson@email.com', '$2b$12$hashed_password_here', TRUE, CURRENT_TIMESTAMP),
('usr-100005', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '$2b$12$hashed_password_here', TRUE, CURRENT_TIMESTAMP);

-- Insert 5 sample library items
INSERT INTO library_items (
    item_id, 
    last_updated_by, 
    status, 
    max_checkout_days, 
    isbn, 
    title, 
    format, 
    genre, 
    creator, 
    image_url
) VALUES
(
    'book-200001',
    'lib-123456',
    'available',
    14,
    '978-0-7432-7356-5',
    'The Da Vinci Code',
    'book',
    'Mystery/Thriller',
    'Dan Brown',
    'https://example.com/images/davinci-code.jpg'
),
(
    'book-200002',
    'lib-123456',
    'available',
    21,
    '978-0-06-112008-4',
    'To Kill a Mockingbird',
    'book',
    'Classic Literature',
    'Harper Lee',
    'https://example.com/images/mockingbird.jpg'
),
(
    'ebook-300001',
    'admin-789012',
    'available',
    7,
    '978-1-4767-2442-2',
    'Steve Jobs',
    'e-book',
    'Biography',
    'Walter Isaacson',
    'https://example.com/images/steve-jobs.jpg'
),
(
    'book-200003',
    'lib-123456',
    'available',
    14,
    '978-0-525-47535-5',
    'Educated',
    'book',
    'Memoir',
    'Tara Westover',
    'https://example.com/images/educated.jpg'
),
(
    'ebook-300002',
    'admin-789012',
    'available',
    10,
    '978-0-307-88789-6',
    'Sapiens: A Brief History of Humankind',
    'e-book',
    'History/Anthropology',
    'Yuval Noah Harari',
    'https://example.com/images/sapiens.jpg'
);

-- Verify the data was inserted correctly
SELECT 
    item_id,
    title,
    format,
    creator,
    status,
    max_checkout_days
FROM library_items 
ORDER BY item_id;

-- Show librarians
SELECT 
    librarian_id,
    first_name,
    last_name,
    email,
    is_active
FROM librarians
ORDER BY librarian_id;

-- Show clients
SELECT 
    client_id,
    first_name,
    last_name,
    email,
    is_active
FROM clients
ORDER BY client_id;