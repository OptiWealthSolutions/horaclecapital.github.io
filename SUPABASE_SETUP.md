# Configuration de Sécurité et Automatisation - Horacle Capital

Ce document détaille les étapes pour finaliser l'infrastructure Supabase de votre projet.

## 1. Déploiement du Schéma SQL (Migrations)

J'ai préparé un fichier de migration dans `supabase/migrations/20260526000000_init_schema.sql`. Il contient :
- La création de la table `profiles`.
- L'activation du **Row Level Security (RLS)**.
- Les politiques d'accès (Policies).
- Le **Trigger automatique** qui crée un profil dès qu'un utilisateur s'inscrit.

### Comment l'appliquer :
1. Liez votre projet local à votre instance Supabase :
   ```bash
   supabase link --project-ref svodjiuypokuvubwfkom
   ```
2. Poussez la migration :
   ```bash
   supabase db push
   ```

## 2. Déploiement des Edge Functions

Trois fonctions sont prêtes à être déployées :
- `send-premium-pdf` : Pour envoyer les rapports PDF par mail aux abonnés.
- `send-feedback` : Pour recevoir les retours utilisateurs directement par mail.
- `stripe-webhook` : Pour automatiser le passage au plan "premium" après paiement.

### Commande de déploiement :
```bash
supabase functions deploy send-premium-pdf send-feedback stripe-webhook
```

## 3. Configuration des Secrets (Variables d'environnement)

Pour que les emails et les paiements fonctionnent, vous devez configurer vos clés secrètes dans Supabase.

### Liste des secrets à configurer :

| Secret | Description | Source |
|---|---|---|
| `RESEND_API_KEY` | Clé API pour l'envoi d'emails | [Resend Dashboard](https://resend.com) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (sk_...) | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Secret de signature du Webhook (whsec_...) | [Stripe Webhooks](https://dashboard.stripe.com/webhooks) |

### Comment les définir :
Exécutez ces commandes en remplaçant les valeurs par vos vraies clés :
```bash
supabase secrets set RESEND_API_KEY=re_your_key
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_key
```

## 4. Configuration finale Stripe

1. Allez dans **Stripe > Developers > Webhooks**.
2. Ajoutez un point de terminaison (Endpoint).
3. URL : `https://svodjiuypokuvubwfkom.supabase.co/functions/v1/stripe-webhook`
4. Événements à écouter : `checkout.session.completed` et `customer.subscription.deleted`.
5. Récupérez le **Signing Secret** et mettez-le à jour dans Supabase (voir étape 3).

---
**Note :** Assurez-vous que l'adresse email `llombardini.leo@gmail.com` est bien vérifiée dans votre compte Resend pour pouvoir envoyer des emails.
