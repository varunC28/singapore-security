-- Migrate existing flat specifications array to grouped format
-- Old format: [{"label": "Resolution", "value": "1080p"}]
-- New format: [{"group": "General", "items": [{"label": "Resolution", "value": "1080p"}]}]

UPDATE products
SET specs = jsonb_build_array(
  jsonb_build_object(
    'group', 'General',
    'items', specs
  )
)
WHERE jsonb_typeof(specs) = 'array' 
  AND jsonb_array_length(specs) > 0 
  AND (specs->0) ? 'label';
