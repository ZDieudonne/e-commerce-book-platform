# Les Éditions La Réforme - E-commerce Platform

Une plateforme e-commerce complète pour la maison d'édition Les Éditions La Réforme, spécialisée dans la littérature africaine francophone.

## Fonctionnalités

### Pour les visiteurs
- Catalogue de livres avec filtres par catégorie et collection
- Pages détaillées des livres avec avis clients
- Panier et processus de commande complet
- Support Mobile Money pour les paiements
- Soumission de manuscrits

### Pour les auteurs
- Tableau de bord personnel
- Suivi des ventes et revenus
- Consultation des avis lecteurs
- Gestion du profil public

### Pour les administrateurs
- Tableau de bord complet avec statistiques
- Gestion des livres et du catalogue
- Validation des commandes et paiements Mobile Money
- Gestion des manuscrits soumis
- Système CMS intégré

## Stack technique

- **Framework**: Next.js 16 (App Router)
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (panier)
- **UI Components**: shadcn/ui

## Installation

1. Clonez le repository
2. Installez les dépendances: `npm install`
3. Configurez vos variables d'environnement Supabase
4. Exécutez les scripts SQL de migration dans l'ordre
5. Lancez le serveur de développement: `npm run dev`

## Variables d'environnement

Les variables Supabase sont déjà configurées dans votre projet v0.

## Structure du projet

- `/app` - Pages et routes Next.js
- `/components` - Composants React réutilisables
- `/lib` - Utilitaires et configuration
- `/scripts` - Scripts SQL pour la base de données

## Contact

Email: lareforme27@gmail.com
WhatsApp: +226 71 67 18 01
