# Configuration de Sécurité et Automatisation - Horacle Capital

Ce document détaille les étapes nécessaires pour sécuriser votre contenu premium et activer l'envoi de PDF par email, conformément aux exigences de cybersécurité.

## 1. Sécurisation de la Base de Données (Supabase RLS)

Pour éviter que n'importe qui puisse modifier son propre plan ou lire les profils des autres, vous devez activer le **Row Level Security (RLS)** sur la table `profiles`.

### Table `profiles`
Exécutez ce SQL dans votre console Supabase :

```sql
-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Autoriser les utilisateurs à lire UNIQUEMENT leur propre profil
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Empêcher les utilisateurs de modifier leur propre plan (doit être fait via webhook Stripe)
CREATE POLICY "Les utilisateurs peuvent modifier leur profil sauf le plan"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

## 2. Automatisation des Emails (Supabase Edge Function)

Le bouton "Recevoir par email" appelle une fonction nommée `send-premium-pdf`. Vous devez la créer et configurer un service d'envoi comme **Resend** ou **SendGrid**.

### Exemple de fonction `send-premium-pdf` (Deno/Supabase)

1. Installez le CLI Supabase.
2. `supabase functions new send-premium-pdf`.
3. Utilisez le code suivant (adapté pour Resend) :

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { articleTitle, articleUrl, userEmail } = await req.json()

  // 1. Vérifier que l'utilisateur est Premium en base (Sécurité)
  const authHeader = req.headers.get('Authorization')!
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )
  
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('plan')
    .single()

  if (profile?.plan !== 'premium') {
    return new Response(JSON.stringify({ error: 'Accès non autorisé' }), { status: 403 })
  }

  // 2. Envoyer l'email via Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Horacle Capital <llombardini.leo@gmail.com>',
      to: [userEmail],
      subject: `Votre recherche : ${articleTitle}`,
      html: `<p>Bonjour,</p><p>Voici le lien vers votre recherche premium : <a href="${articleUrl}">${articleTitle}</a></p>`,
    }),
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
```

**Note :** Vous devrez vérifier votre adresse `llombardini.leo@gmail.com` dans le tableau de bord de Resend pour pouvoir envoyer des emails depuis celle-ci.

## 3. Webhook Stripe

Pour que le plan passe automatiquement à "premium" après le paiement :
1. Créez une Edge Function `stripe-webhook`.
2. Configurez Stripe pour envoyer l'événement `checkout.session.completed` à cette URL.
3. La fonction doit mettre à jour la table `profiles` pour l'utilisateur correspondant (via le `client_reference_id` qui doit être l'ID Supabase de l'utilisateur).
