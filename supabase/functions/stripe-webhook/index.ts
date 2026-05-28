import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature', { status: 400 })
  }

  const body = await req.text()

  // Vérifier la signature Stripe
  let event: { type: string; data: { object: Record<string, unknown> } }
  try {
    // Import Stripe SDK pour vérification signature
    const { Stripe } = await import('https://esm.sh/stripe@14?target=deno')
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })
    event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET ?? '')
  } catch (err) {
    console.error('Signature invalide:', err)
    return new Response(`Webhook Error: ${err}`, { status: 400 })
  }

  // Seul événement qui nous intéresse : paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      client_reference_id: string;
      customer_email: string;
      customer: string;
    }

    // client_reference_id = Supabase user ID (à passer lors de la création de la session Stripe)
    const userId = session.client_reference_id

    if (!userId) {
      console.error('Pas de client_reference_id dans la session')
      return new Response('Missing client_reference_id', { status: 400 })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ plan: 'premium', updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Erreur update profiles:', error)
      return new Response('DB error', { status: 500 })
    }

    console.log(`User ${userId} upgraded to premium`)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as { metadata: { supabase_user_id: string } }
    const userId = subscription.metadata?.supabase_user_id

    if (userId) {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )
      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free', updated_at: new Date().toISOString() })
        .eq('id', userId)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
