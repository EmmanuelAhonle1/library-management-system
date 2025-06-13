-- Sample Data for Library Management System - MySQL Version
-- ===========================================================
-- This script inserts sample librarians, clients, and 5 library items

-- Insert sample librarians first (needed for foreign key references)
INSERT INTO librarians (librarian_id, first_name, last_name, email, password, is_active, created_date) VALUES
('libra-123456', 'Sarah', 'Johnson', 'sarah.johnson@library.com', '$2b$12$hashed_password_here', TRUE, NOW()),
('admin-789012', 'Michael', 'Chen', 'michael.chen@library.com', '$2b$12$hashed_password_here', TRUE, NOW());

-- Insert sample clients
INSERT INTO clients (client_id, first_name, last_name, email, password, is_active, created_date) VALUES
('cli-100001', 'Emily', 'Rodriguez', 'emily.rodriguez@email.com', '$2b$12$hashed_password_here', TRUE, NOW()),
('cli-100002', 'James', 'Wilson', 'james.wilson@email.com', '$2b$12$hashed_password_here', TRUE, NOW()),
('cli-100003', 'Maria', 'Garcia', 'maria.garcia@email.com', '$2b$12$hashed_password_here', TRUE, NOW()),
('cli-100004', 'David', 'Thompson', 'david.thompson@email.com', '$2b$12$hashed_password_here', TRUE, NOW()),
('cli-100005', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '$2b$12$hashed_password_here', TRUE, NOW());

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
    'libra-123456',
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
    'libra-123456',
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
    'libra-123456',
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

-- ==============================================
-- SAMPLE TRANSACTION DATA
-- ==============================================

-- No checkout or hold transactions yet - all items remain available
-- This demonstrates a fresh library with items ready for checkout

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

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

-- Show recent transactions (should only show audit logs from item additions)
SELECT 
    'No client transactions yet - all items available for checkout' AS transaction_status;

-- Show audit logs (should show item additions by librarians)
SELECT 
    a.audit_id,
    a.transaction_type,
    a.transaction_date,
    a.description,
    l.first_name AS librarian_first_name,
    l.last_name AS librarian_last_name,
    i.title AS item_title
FROM item_audit_logs a
JOIN librarians l ON a.librarian_id = l.librarian_id
JOIN library_items i ON a.item_id = i.item_id
ORDER BY a.transaction_date DESC;

-- ==============================================
-- TEST BUSINESS LOGIC FUNCTIONS
-- ==============================================

-- Test if users can checkout items (all should return TRUE since no items are checked out)
SELECT 
    'cli-100001' AS client_id,
    'book-200001' AS item_id,
    CanCheckoutItem('cli-100001', 'book-200001') AS can_checkout;

SELECT 
    'cli-100002' AS client_id,
    'book-200002' AS item_id,
    CanCheckoutItem('cli-100002', 'book-200002') AS can_checkout;

-- Test if users can return items (all should return FALSE since no items are checked out)
SELECT 
    'cli-100001' AS client_id,
    'book-200001' AS item_id,
    CanReturnItem('cli-100001', 'book-200001') AS can_return;

-- Process expired holds (manual test)
CALL ProcessExpiredHolds(@expired_count);
SELECT @expired_count AS 'Expired Holds Processed';

-- ==============================================
-- EXAMPLE WORKFLOW TRANSACTIONS
-- ==============================================

/*
-- Example 1: Complete checkout and return workflow
-- First, checkout an available book
INSERT INTO item_transactions (transaction_id, client_id, item_id, transaction_type)
VALUES ('chkot-WORKFLOW01', 'cli-100003', 'book-200003', 'checkout');

-- Later, return the book
INSERT INTO item_transactions (transaction_id, client_id, item_id, transaction_type)
VALUES ('retrn-WORKFLOW01', 'cli-100003', 'book-200003', 'return');

-- Example 2: Hold workflow
-- Place a hold on a checked-out item
INSERT INTO item_transactions (transaction_id, client_id, item_id, transaction_type)
VALUES ('hold-WORKFLOW02', 'cli-100004', 'book-200001', 'hold');

-- When the item is returned, it goes on hold for cli-100004
-- cli-100004 can then check it out
INSERT INTO item_transactions (transaction_id, client_id, item_id, transaction_type)
VALUES ('chkot-WORKFLOW02', 'cli-100004', 'book-200001', 'checkout');

-- Example 3: Cancel a hold
INSERT INTO item_transactions (transaction_id, client_id, item_id, transaction_type)
VALUES ('cancl-WORKFLOW03', 'cli-100005', 'ebook-300001', 'cancel_hold');
*/