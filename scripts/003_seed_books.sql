-- Insert first book: Chroniques Sacrées
INSERT INTO public.books (
  title,
  slug,
  author_name,
  description,
  price_physical,
  price_pdf,
  stock_physical,
  is_pdf_available,
  is_active,
  is_featured,
  category_id
) VALUES (
  'Chroniques Sacrées',
  'chroniques-sacrees',
  'DIEUDONNÉ ZONGO',
  'Livre Poétique peignant l''Afrique et le monde aux couleurs actuelles tout en projetant un Futur Radieux malgré le passé compliqué.',
  3500,
  2500,
  50,
  true,
  true,
  true,
  (SELECT id FROM public.categories WHERE slug = 'poesie' LIMIT 1)
) ON CONFLICT (slug) DO NOTHING;

-- Link to Nouveauté collection
INSERT INTO public.book_collections (book_id, collection_id)
SELECT 
  (SELECT id FROM public.books WHERE slug = 'chroniques-sacrees' LIMIT 1),
  (SELECT id FROM public.collections WHERE slug = 'nouveaute' LIMIT 1)
ON CONFLICT DO NOTHING;
