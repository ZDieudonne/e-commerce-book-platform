// Importer Supabase
import { createClient } from '@supabase/supabase-js';

// ⚡ Remplace les valeurs ci-dessous par tes infos
const supabaseUrl = 'https://jnucsgizpotsdhwpnjqe.supabase.co';
const supabaseKey = 'sb_publishable_93ioeQLO5WKGJD0ddlBBKA_LKrcTFjz';

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  // Récupérer toutes les données de la table 'books'
  const { data, error } = await supabase
    .from('books') // ⚡ Mets ici le nom exact de ta table si différent
    .select('*');   // ⚡ Ici tu peux filtrer ou modifier les colonnes si besoin

  if (error) {
    console.error('Erreur Supabase:', error);
  } else {
    console.log('Données récupérées:', data);
  }
}

// Lancer le test
testSupabase();