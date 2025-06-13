-- Library Management System Database Schema - MySQL Version
-- =============================================================

-- Note: ID validation will be handled in application logic
-- MySQL doesn't support custom functions for CHECK constraints like PostgreSQL

-- ==============================================
-- CORE TABLES
-- ==============================================

-- Clients table: Library patrons who can borrow items
CREATE TABLE clients (
    client_id VARCHAR(12) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Should be hashed in application
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    -- ID format validation via CHECK constraint (MySQL 8.0.16+)
    CONSTRAINT chk_client_id_format CHECK (client_id REGEXP '^[a-z]{2,5}-[0-9]{6}$')
);

-- Librarians table: Staff members who manage the library
CREATE TABLE librarians (
    librarian_id VARCHAR(12) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Should be hashed in application
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    -- ID format validation via CHECK constraint (MySQL 8.0.16+)
    CONSTRAINT chk_librarian_id_format CHECK (librarian_id REGEXP '^[a-z]{2,5}-[0-9]{6}$')
);

-- Library items: Books, DVDs, etc. available for checkout
CREATE TABLE library_items (
    item_id VARCHAR(12) PRIMARY KEY,
    last_updated_by VARCHAR(12) NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('available', 'checked_out', 'on_hold', 'lost', 'damaged') DEFAULT 'available',
    max_checkout_days INTEGER DEFAULT 14,
    isbn VARCHAR(20),
    title VARCHAR(500) NOT NULL,
    format ENUM('book', 'e-book') DEFAULT 'book',
    genre VARCHAR(100),
    creator VARCHAR(200), -- Author, director, etc.
    image_url VARCHAR(500),
    
    CONSTRAINT chk_item_id_format CHECK (item_id REGEXP '^[a-z]{2,5}-[0-9]{6}$'),
    CONSTRAINT chk_max_checkout_days CHECK (max_checkout_days > 0),
    CONSTRAINT fk_items_librarian FOREIGN KEY (last_updated_by) REFERENCES librarians(librarian_id)
);

-- Item audit logs: Track all changes to library items
CREATE TABLE item_audit_logs (
    audit_id VARCHAR(18) PRIMARY KEY,
    item_id VARCHAR(12) NOT NULL,
    librarian_id VARCHAR(12) NOT NULL,
    transaction_type ENUM('item_added', 'item_updated', 'item_deleted', 'status_changed') NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    
    CONSTRAINT chk_audit_id_format CHECK (audit_id REGEXP '^[a-z]{2,5}-[A-Za-z0-9]{12}$'),
    CONSTRAINT fk_audit_item FOREIGN KEY (item_id) REFERENCES library_items(item_id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_librarian FOREIGN KEY (librarian_id) REFERENCES librarians(librarian_id)
);

-- Item transactions: Track checkouts, returns, holds, etc.
CREATE TABLE item_transactions (
    transaction_id VARCHAR(18) PRIMARY KEY,
    client_id VARCHAR(12),
    item_id VARCHAR(12) NOT NULL,
    transaction_type ENUM('checkout', 'return', 'hold', 'cancel_hold', 'renewal', 'hold_expired') NOT NULL,
    transaction_date TIMESTAMP NULL,
    due_date TIMESTAMP NULL,
    return_date TIMESTAMP NULL,
    status ENUM('active', 'completed', 'overdue', 'cancelled', 'expired') DEFAULT 'active',
    hold_expiry_date TIMESTAMP NULL, -- When a hold expires (typically 3-7 days after item becomes available)
    
    CONSTRAINT chk_transaction_id_format CHECK (transaction_id REGEXP '^[a-z]{2,5}-[A-Za-z0-9]{12}$'),
    CONSTRAINT fk_transaction_client FOREIGN KEY (client_id) REFERENCES clients(client_id),
    CONSTRAINT fk_transaction_item FOREIGN KEY (item_id) REFERENCES library_items(item_id)
);

-- ==============================================
-- TRIGGERS AND BUSINESS LOGIC
-- ==============================================

DELIMITER //

-- Trigger: Auto-calculate due dates for checkouts and hold expiry dates
CREATE TRIGGER set_due_date_trigger
    BEFORE INSERT ON item_transactions
    FOR EACH ROW
BEGIN
    -- Only calculate due date for checkouts
    IF NEW.transaction_type = 'checkout' THEN
        -- Get max checkout days for this item
        SET @max_days = (SELECT max_checkout_days FROM library_items WHERE item_id = NEW.item_id);
        
        -- Set due date: round up current date to next day + max_checkout_days
        SET NEW.due_date = DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL @max_days DAY);
        SET NEW.transaction_date = NOW();
    END IF;
    
    -- Set hold expiry date for holds (3 days from when hold becomes available)
    IF NEW.transaction_type = 'hold' THEN
        SET NEW.hold_expiry_date = DATE_ADD(CURDATE(), INTERVAL 4 DAY); -- 3 full days to pick up
        SET NEW.transaction_date = NOW(); -- When hold was placed
    END IF;
END//

-- Trigger: Update item status based on transactions
CREATE TRIGGER update_item_status_trigger
    BEFORE INSERT ON item_transactions
    FOR EACH ROW
BEGIN
    DECLARE hold_exists INT DEFAULT 0;
    
    -- Handle different transaction types
    CASE NEW.transaction_type
        WHEN 'checkout' THEN
            UPDATE library_items 
            SET status = 'checked_out', date_last_updated = NOW() 
            WHERE item_id = NEW.item_id;
            
        WHEN 'return' THEN
            -- Mark transaction as completed
            SET NEW.return_date = NOW();
            SET NEW.status = 'completed';
            
            -- Check if there is an active hold for this item
            SELECT COUNT(*) INTO hold_exists
            FROM item_transactions 
            WHERE item_id = NEW.item_id 
            AND transaction_type = 'hold' 
            AND status = 'active';
            
            IF hold_exists > 0 THEN
                UPDATE library_items 
                SET status = 'on_hold', date_last_updated = NOW() 
                WHERE item_id = NEW.item_id;
            ELSE
                UPDATE library_items 
                SET status = 'available', date_last_updated = NOW() 
                WHERE item_id = NEW.item_id;
            END IF;
            
        WHEN 'hold' THEN
            -- Check if item already has an active hold
            SELECT COUNT(*) INTO hold_exists
            FROM item_transactions 
            WHERE item_id = NEW.item_id 
            AND transaction_type = 'hold' 
            AND status = 'active';
            
            IF hold_exists = 0 THEN
                UPDATE library_items 
                SET status = 'on_hold', date_last_updated = NOW() 
                WHERE item_id = NEW.item_id AND status = 'available';
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Item already has an active hold';
            END IF;
            
        WHEN 'cancel_hold' THEN
            SET NEW.status = 'cancelled';
            -- Set item back to available since only one hold is allowed
            UPDATE library_items 
            SET status = 'available', date_last_updated = NOW() 
            WHERE item_id = NEW.item_id;
    END CASE;
END//

-- Trigger: Create audit log when items are added
CREATE TRIGGER item_audit_insert_trigger
    AFTER INSERT ON library_items
    FOR EACH ROW
BEGIN
    INSERT INTO item_audit_logs (audit_id, item_id, librarian_id, transaction_type, description)
    VALUES (
        CONCAT('aud-', UPPER(SUBSTRING(MD5(RAND()), 1, 12))),
        NEW.item_id,
        NEW.last_updated_by,
        'item_added',
        CONCAT('New item added: ', NEW.title)
    );
END//

-- Trigger: Create audit log when items are updated
CREATE TRIGGER item_audit_update_trigger
    AFTER UPDATE ON library_items
    FOR EACH ROW
BEGIN
    INSERT INTO item_audit_logs (audit_id, item_id, librarian_id, transaction_type, description)
    VALUES (
        CONCAT('aud-', UPPER(SUBSTRING(MD5(RAND()), 1, 12))),
        NEW.item_id,
        NEW.last_updated_by,
        CASE 
            WHEN OLD.status != NEW.status THEN 'status_changed'
            ELSE 'item_updated'
        END,
        CASE 
            WHEN OLD.status != NEW.status THEN CONCAT('Status changed from ', OLD.status, ' to ', NEW.status)
            ELSE 'Item details updated'
        END
    );
END//

-- Trigger: Mark transactions as overdue and expire holds
CREATE TRIGGER overdue_check_trigger
    BEFORE UPDATE ON item_transactions
    FOR EACH ROW
BEGIN
    -- Check if due date has passed and transaction is still active
    IF NEW.due_date < NOW() AND NEW.status = 'active' AND NEW.transaction_type = 'checkout' THEN
        SET NEW.status = 'overdue';
    END IF;
    
    -- Check if hold has expired
    IF NEW.hold_expiry_date < NOW() AND NEW.status = 'active' AND NEW.transaction_type = 'hold' THEN
        SET NEW.status = 'expired';
    END IF;
END//

DELIMITER ;

-- ==============================================
-- STORED PROCEDURES FOR BUSINESS LOGIC
-- ==============================================

DELIMITER //

-- Procedure: Process expired holds and create hold_expired transactions
CREATE PROCEDURE ProcessExpiredHolds(OUT expired_count INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_transaction_id VARCHAR(18);
    DECLARE v_client_id VARCHAR(12);
    DECLARE v_item_id VARCHAR(12);
    DECLARE v_hold_expiry_date TIMESTAMP;
    DECLARE new_transaction_id VARCHAR(18);
    
    DECLARE expired_cursor CURSOR FOR 
        SELECT transaction_id, client_id, item_id, hold_expiry_date
        FROM item_transactions
        WHERE transaction_type = 'hold' 
        AND status = 'active'
        AND hold_expiry_date < NOW();
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SET expired_count = 0;
    
    OPEN expired_cursor;
    
    read_loop: LOOP
        FETCH expired_cursor INTO v_transaction_id, v_client_id, v_item_id, v_hold_expiry_date;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Mark the hold as expired
        UPDATE item_transactions 
        SET status = 'expired'
        WHERE transaction_id = v_transaction_id;
        
        -- Create a hold_expired transaction record for audit trail
        SET new_transaction_id = CONCAT('exp-', UPPER(SUBSTRING(MD5(RAND()), 1, 12)));
        INSERT INTO item_transactions (
            transaction_id, client_id, item_id, transaction_type, 
            transaction_date, status, return_date
        ) VALUES (
            new_transaction_id,
            v_client_id,
            v_item_id,
            'hold_expired',
            v_hold_expiry_date,
            'completed',
            NOW()
        );
        
        -- Since only one hold per item, item becomes available
        UPDATE library_items 
        SET status = 'available', date_last_updated = NOW()
        WHERE item_id = v_item_id;
        
        SET expired_count = expired_count + 1;
    END LOOP;
    
    CLOSE expired_cursor;
END//

-- Function: Check if item can be checked out by a specific client
CREATE FUNCTION CanCheckoutItem(p_client_id VARCHAR(12), p_item_id VARCHAR(12))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE item_status VARCHAR(20);
    DECLARE hold_client VARCHAR(12);
    DECLARE expired_count INT;
    
    -- Process any expired holds first
    CALL ProcessExpiredHolds(expired_count);
    
    -- Get current item status
    SELECT status INTO item_status FROM library_items WHERE item_id = p_item_id;
    
    -- Item must exist
    IF item_status IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- If item is available, anyone can check it out
    IF item_status = 'available' THEN
        RETURN TRUE;
    END IF;
    
    -- If item is on hold, only the person who placed the hold can check it out
    IF item_status = 'on_hold' THEN
        SELECT client_id INTO hold_client
        FROM item_transactions 
        WHERE item_id = p_item_id 
        AND transaction_type = 'hold' 
        AND status = 'active'
        LIMIT 1;
        
        RETURN (hold_client = p_client_id);
    END IF;
    
    -- Item is checked out or unavailable
    RETURN FALSE;
END//

-- Function: Check if client can return an item
CREATE FUNCTION CanReturnItem(p_client_id VARCHAR(12), p_item_id VARCHAR(12))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE result BOOLEAN DEFAULT FALSE;
    
    -- Check if client has an active checkout for this item
    SELECT COUNT(*) > 0 INTO result
    FROM item_transactions
    WHERE client_id = p_client_id
    AND item_id = p_item_id
    AND transaction_type = 'checkout'
    AND status IN ('active', 'overdue');
    
    RETURN result;
END//

DELIMITER ;

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Performance indexes
CREATE INDEX idx_transactions_client_active ON item_transactions(client_id, status);
CREATE INDEX idx_transactions_item_active ON item_transactions(item_id, status);
CREATE INDEX idx_transactions_due_date ON item_transactions(due_date, status);
CREATE INDEX idx_transactions_hold_expiry ON item_transactions(hold_expiry_date, status);
CREATE INDEX idx_items_status ON library_items(status);
CREATE INDEX idx_audit_logs_item_date ON item_audit_logs(item_id, transaction_date);

-- ==============================================
-- USAGE EXAMPLES
-- ==============================================

/*
-- Example: Check if a client can checkout an item
SELECT CanCheckoutItem('cli-123456', 'itm-789012') as can_checkout;

-- Example: Check if a client can return an item
SELECT CanReturnItem('cli-123456', 'itm-789012') as can_return;

-- Example: Process expired holds manually
CALL ProcessExpiredHolds(@expired_count);
SELECT @expired_count as 'Expired Holds Processed';

-- Example: Insert a new checkout transaction
INSERT INTO item_transactions (transaction_id, client_id, item_id, transaction_type)
VALUES ('chk-ABC123DEF456', 'cli-123456', 'itm-789012', 'checkout');

-- Example: Insert a return transaction
INSERT INTO item_transactions (transaction_id, client_id, item_id, transaction_type)
VALUES ('ret-XYZ789GHI012', 'cli-123456', 'itm-789012', 'return');
*/