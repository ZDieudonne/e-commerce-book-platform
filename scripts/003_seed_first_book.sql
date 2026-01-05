-- Create an author for Dieudonné Zongo (without linking to a user initially)
INSERT INTO authors (id, bio, is_active, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Dieudonné ZONGO est un poète burkinabè contemporain dont l''œuvre explore les réalités africaines avec profondeur et espoir.',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Get the category ID for Poésie
DO $$
DECLARE
  poetry_category_id UUID;
  novelty_collection_id UUID;
BEGIN
  SELECT id INTO poetry_category_id FROM categories WHERE slug = 'poesie';
  SELECT id INTO novelty_collection_id FROM collections WHERE slug = 'nouveaute';
  
  -- Insert the book "Chroniques Sacrées"
  INSERT INTO books (
    title,
    slug,
    author_id,
    category_id,
    collection_id,
    description,
    price,
    pages,
    language,
    published_date,
    cover_image_url,
    stock_quantity,
    is_active,
    is_featured
  ) VALUES (
    'Chroniques Sacrées',
    'chroniques-sacrees',
    '11111111-1111-1111-1111-111111111111',
    poetry_category_id,
    novelty_collection_id,
    'Livre Poétique peignant l''Afrique et le monde aux couleurs actuelles tout en projetant un Futur Radieux malgré le passé compliqué. Une œuvre qui célèbre la résilience et l''espoir du continent africain à travers des vers puissants et évocateurs.',
    3500,
    120,
    'Français',
    CURRENT_DATE,
    '/placeholder.svg?height=600&width=400',
    50,
    true,
    true
  )
  ON CONFLICT (slug) DO NOTHING;
END $$;
