# Configuration Email & Délivrabilité — Horacle Capital

Ce guide détaille les étapes techniques pour garantir que vos emails (Newsletter via Brevo et PDF via Resend) arrivent en boîte de réception et non en spams.

## 1. Authentification du Domaine (DNS)

Vous devez ajouter ces enregistrements chez votre hébergeur de domaine (ex: Cloudflare, Namecheap, OVH).

### A. SPF (Sender Policy Framework)
Le SPF indique quels serveurs sont autorisés à envoyer des emails pour `@horaclecapital.com`.
**Comme vous utilisez Brevo ET Resend, vous devez combiner les deux.**

*   **Type :** TXT
*   **Hôte :** `@` (ou vide)
*   **Valeur :** `v=spf1 include:spf.brevo.com include:amazonses.com ~all`
    *(Note : Resend utilise souvent Amazon SES en infrastructure, vérifiez la valeur précise dans votre dashboard Resend > Domains).*

### B. DKIM (DomainKeys Identified Mail)
Le DKIM ajoute une signature numérique à vos emails.

*   **Pour Brevo :** Allez dans *Paramètres > Expéditeurs et Domaines > Domaines*. Cliquez sur "Configurer". Brevo vous donnera un nom d'hôte (ex: `mail._domainkey`) et une valeur TXT longue.
*   **Pour Resend :** Allez dans *Domains > horaclecapital.com*. Copiez les 3 enregistrements CNAME fournis par Resend.

### C. DMARC (Domain-based Message Authentication)
Le DMARC indique quoi faire si un email échoue au SPF ou DKIM. C'est **obligatoire** pour Gmail et Yahoo en 2024.

*   **Type :** TXT
*   **Hôte :** `_dmarc`
*   **Valeur :** `v=DMARC1; p=none;`
    *(p=none signifie "surveiller seulement". Une fois que tout fonctionne, on pourra passer à p=quarantine).*

---

## 2. Utilisation Brevo vs Resend

### Brevo (Marketing / Newsletter)
*   **Usage :** Envoi de masse, campagnes hebdomadaires, gestion de la liste d'abonnés.
*   **Configuration Site :** Les formulaires sur le site pointent vers l'URL `action` de votre formulaire Brevo.
*   **Avantage :** Gestion automatique des désinscriptions (obligatoire).

### Resend (Transactionnel)
*   **Usage :** Envoi automatique des rapports PDF Premium, notifications de compte, formulaires de contact.
*   **Configuration Site :** Géré via les Supabase Edge Functions (`supabase/functions/send-premium-pdf`).
*   **Avantage :** Délivrabilité maximale pour les emails critiques.

---

## 3. Checklist Anti-Spam
1.  **Lien de désinscription :** Toujours présent dans Brevo.
2.  **Adresse physique :** Doit figurer en bas des emails Brevo (loi anti-spam).
3.  **Nom d'expéditeur clair :** "Léo de Horacle Capital" ou "Horacle Capital".
4.  **Ratio Texte/Image :** Évitez les emails composés uniquement d'une grande image.
5.  **Nettoyage de liste :** Brevo supprimera automatiquement les "bounces" (emails invalides).

---

## 4. Test de Délivrabilité
Avant d'envoyer votre première grosse newsletter, envoyez un email de test à [Mail-Tester.com](https://www.mail-tester.com). Il vous donnera une note sur 10 et identifiera les erreurs DNS restantes.
