-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Poésie', 'poesie', 'Recueils de poèmes et œuvres poétiques'),
  ('Romans', 'romans', 'Romans et fiction littéraire'),
  ('Nouvelles', 'nouvelles', 'Recueils de nouvelles'),
  ('Essais & Réflexions', 'essais-reflexions', 'Essais, analyses et réflexions'),
  ('Biographies & Témoignages', 'biographies-temoignages', 'Biographies et récits de vie'),
  ('Contes', 'contes', 'Contes traditionnels et modernes'),
  ('Théâtre', 'theatre', 'Pièces de théâtre'),
  ('Développement personnel', 'developpement-personnel', 'Guides et ouvrages de développement personnel')
ON CONFLICT (slug) DO NOTHING;

-- Insert collections
INSERT INTO public.collections (name, slug, description, display_order) VALUES
  ('Nouveauté', 'nouveaute', 'Dernières parutions et nouveaux titres', 1),
  ('Meilleures ventes', 'meilleures-ventes', 'Nos livres les plus vendus', 2),
  ('Coups de coeur', 'coups-de-coeur', 'Sélection de la rédaction', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', '"Les Éditions La Réforme"'),
  ('site_description', '"Maison d''édition africaine spécialisée dans la littérature francophone"'),
  ('contact_email', '"lareforme27@gmail.com"'),
  ('contact_phone', '"+226 71 67 18 01"'),
  ('whatsapp_number', '"+226 71 67 18 01"'),
  ('orange_money', '"+226 75.79.54.44"'),
  ('moov_money', '"+226 71 67 18 01"'),
  ('facebook_url', '"https://www.facebook.com/share/1B3xuWdWxy/"'),
  ('shipping_burkina', '{"enabled": true, "cost": 0, "free_threshold": 0}'),
  ('shipping_international', '{"enabled": true, "cost": 5000, "minimum_books": 10}'),
  ('featured_message', '"Découvrez nos dernières publications et soutenez la littérature africaine"')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert CMS pages
INSERT INTO public.cms_pages (slug, title, content, meta_title, meta_description, is_active) VALUES
  ('accueil', 'Accueil', '{"sections": []}', 'Les Éditions La Réforme - Accueil', 'Découvrez les éditions La Réforme, maison d''édition africaine', true),
  ('a-propos', 'À propos', '{"sections": [{"type": "text", "content": "Les Éditions La Réforme est une maison d''édition burkinabè dédiée à la promotion de la littérature africaine francophone."}]}', 'À propos - Les Éditions La Réforme', 'En savoir plus sur Les Éditions La Réforme', true),
  ('contact', 'Contact', '{"sections": []}', 'Nous contacter', 'Contactez Les Éditions La Réforme', true),
  ('cgv', 'Conditions Générales de Vente', '{"sections": [{"type": "text", "content": "Conditions générales de vente à compléter"}]}', 'CGV', 'Conditions générales de vente', true),
  ('mentions-legales', 'Mentions Légales', '{"sections": [{"type": "text", "content": "Mentions légales à compléter"}]}', 'Mentions Légales', 'Mentions légales du site', true)
ON CONFLICT (slug) DO NOTHING;
