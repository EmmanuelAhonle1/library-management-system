# Library Management System Business Logic

## ID Format Validation

**User IDs** (clients, librarians, library_items):

- Pattern: `/^[a-z]{2,5}-[0-9]{6}$/`
- **Chosen Prefixes:**
  - `admin-123456` - Admin users
  - `libra-123456` - Librarian users
  - `user-123456` - Regular users
  - `cli-123456` - Client users
  - `book-123456` - Book items
  - `ebook-123456` - E-book items

**Transaction IDs** (item_transactions, item_audit_logs):

- Pattern: `/^[a-z]{2,5}-[A-Za-z0-9]{12}$/`
- **Chosen Prefixes:**
  - `chkot-ABC123DEF456` - Checkout transactions
  - `retrn-ABC123DEF456` - Return transactions
  - `hold-ABC123DEF456` - Hold transactions
  - `cancl-ABC123DEF456` - Cancel hold transactions
  - `renew-ABC123DEF456` - Renewal transactions
  - `expir-ABC123DEF456` - Expired hold transactions (auto-generated)

**Audit Log IDs** (item_audit_logs):

- Pattern: `/^[a-z]{2,5}-[A-Za-z0-9]{12}$/`
- **Chosen Prefixes by Audit Type:**
  - `addtm-ABC123DEF456` - Item added audits (`item_added`)
  - `updtm-ABC123DEF456` - Item updated audits (`item_updated`)
  - `deltm-ABC123DEF456` - Item deleted audits (`item_deleted`)
  - `sttus-ABC123DEF456` - Status changed audits (`status_changed`)

## Due Date Calculation

Automatically calculated on checkout transactions:

- Rounds up to next day + max_checkout_days from item settings
- Example: Item checked out at 2:30 PM with 14-day limit = due date is 15 days from now at midnight
- Creates transaction with prefix `chkot-` for checkout records

## Status Management

**Item Status Flow:**

- Items start as `available`
- Checkout changes status to `checked_out` (generates `chkot-` transaction)
- Return checks for holds: if holds exist → `on_hold`, else → `available` (generates `retrn-` transaction)
- Hold only works on `available` items, changes status to `on_hold` (generates `hold-` transaction)

## Checkout Validation

**Available items:** Anyone can check out
**On-hold items:** Only the person who placed the hold can check it out
**Checked-out items:** Cannot be checked out by others

- Validation handled by `CanCheckoutItem()` function
- Successful checkouts create `chkot-` prefixed transaction records

## Return Validation

- Only the person who checked out the item can return it
- Validates against active checkout transaction
- Validation handled by `CanReturnItem()` function
- Successful returns create `retrn-` prefixed transaction records

## Hold System (Single Item Library)

- Only one copy of each item exists in the library
- Only one hold allowed per item at a time
- Hold placement is first-come-first-served (no queue)
- Hold transactions use `hold-` prefix
- Hold cancellations use `cancl-` prefix
- Holds expire after 3 days if not picked up
- When hold expires: item automatically becomes `available`
- Expired holds generate `expir-` prefixed transaction records
- Automatic processing via `ProcessExpiredHolds()` stored procedure

## Overdue Handling

- Transactions automatically marked as `overdue` when due date passes
- Can be checked via trigger or batch job
- Overdue items maintain their original `chkot-` transaction ID

## Audit Trail

- Every item change is logged with librarian responsible
- **Audit Types and Prefixes:**
  - Item additions: `addtm-` prefix with `item_added` type
  - Item updates: `updtm-` prefix with `item_updated` type
  - Item deletions: `deltm-` prefix with `item_deleted` type
  - Status changes: `sttus-` prefix with `status_changed` type
- Hold expirations create `expir-` prefixed transaction records
- Links to the specific action date matching item's date_last_updated

## Data Integrity

- Foreign key constraints maintain referential integrity
- Cascading deletes for audit logs when items are removed
- Status constraints prevent invalid states
- ID format validation via CHECK constraints using regex patterns

## Performance Optimizations

- Indexes on frequently queried fields
- Partial indexes for active transactions only
- Efficient hold queue queries

## Hold Expiration Automation

- Call `ProcessExpiredHolds()` stored procedure regularly via cron job
- Automatically processes expired holds and makes items available
- Creates audit trail for all hold expirations using `expir-` prefix
- Items become available immediately when holds expire (no queue)

## Key Business Rules

1. **Single Copy Library:** Only one copy of each item exists
2. **One Hold Per Item:** Maximum one active hold per item at any time
3. **Format Restrictions:** Only `book` and `e-book` formats are allowed
4. **Hold Expiry:** 3 days to pick up items once they become available
5. **No Hold Queue:** First person to place hold gets it, no waiting list
6. **Audit Completeness:** Every action creates a transaction record for full traceability
7. **Status Consistency:** Item status always reflects current transaction state
8. **ID Consistency:** All IDs follow standardized prefix patterns for easy identification and debugging

## Transaction Prefix Quick Reference

| Action        | Transaction Type | Prefix   | Example ID           |
| ------------- | ---------------- | -------- | -------------------- |
| User checkout | `checkout`       | `chkot-` | `chkot-A1B2C3D4E5F6` |
| User return   | `return`         | `retrn-` | `retrn-G7H8I9J0K1L2` |
| Place hold    | `hold`           | `hold-`  | `hold-M3N4O5P6Q7R8`  |
| Cancel hold   | `cancel_hold`    | `cancl-` | `cancl-S9T0U1V2W3X4` |
| Renew item    | `renewal`        | `renew-` | `renew-Y5Z6A7B8C9D0` |
| Hold expires  | `hold_expired`   | `expir-` | `expir-E1F2G3H4I5J6` |

## Audit Prefix Quick Reference

| Audit Type     | Prefix   | Example ID           |
| -------------- | -------- | -------------------- |
| Item Added     | `addtm-` | `addtm-K7L8M9N0O1P2` |
| Item Updated   | `updtm-` | `updtm-Q3R4S5T6U7V8` |
| Item Deleted   | `deltm-` | `deltm-W9X0Y1Z2A3B4` |
| Status Changed | `sttus-` | `sttus-C5D6E7F8G9H0` |
