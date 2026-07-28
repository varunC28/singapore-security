-- Add sort_order column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Optional: If you want to update existing rows to have an incrementing sort_order based on their creation date
WITH numbered_categories AS (
  SELECT id, row_number() OVER (ORDER BY created_at) - 1 as new_order
  FROM categories
)
UPDATE categories
SET sort_order = numbered_categories.new_order
FROM numbered_categories
WHERE categories.id = numbered_categories.id;
