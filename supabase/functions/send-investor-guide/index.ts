import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1. Sauvegarder le lead dans Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { error: dbError } = await supabaseAdmin
      .from('leads')
      .upsert({ email, source: 'guide_investisseur', created_at: new Date().toISOString() }, { onConflict: 'email' })

    if (dbError) {
      console.error("DB error:", dbError)
      // On continue quand même l'envoi de l'email même si la DB échoue
    }

    // 2. Envoyer l'email via Resend
    const emailBody = {
      from: 'Horacle Capital <newsletter@horaclecapital.com>',
      reply_to: 'llombardini.leo@gmail.com',
      to: [email],
      subject: `Confirmation d'inscription : Liste d'attente Guide 2026`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e; line-height: 1.6;">
          <h2 style="border-bottom: 2px solid #2563EB; padding-bottom: 12px; color: #2563EB;">Horacle Academy</h2>
          <p>Bonjour,</p>
          <p>C'est confirmé ! Vous êtes bien inscrit sur la liste d'attente pour recevoir notre guide stratégique : <strong>"L’investissement : Le guide honnête pour passer à l'action"</strong>.</p>
          <p>Nous sommes actuellement en train de finaliser les dernières sections pour vous offrir une ressource de la plus haute qualité possible.</p>
          <p><strong>Que va-t-il se passer ensuite ?</strong></p>
          <ul>
            <li>Vous serez parmi les premiers à recevoir le guide directement dans votre boîte mail dès sa sortie.</li>
            <li>Vous recevrez également nos analyses hebdomadaires pour commencer à vous familiariser avec notre approche macroéconomique.</li>
          </ul>
          <p>Merci pour votre patience et votre confiance.</p>
          <p>À très vite,<br><strong>Léo Lombardini</strong></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="font-size: 0.8rem; color: #64748b;">© 2026 Horacle Capital. Tous droits réservés.</p>
        </div>
      `,
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailBody),
    })

    const resendData = await resendRes.json()

    if (!resendRes.ok) {
      console.error("Resend error:", resendData)
      return new Response(
        JSON.stringify({ error: 'Erreur envoi email', details: resendData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error("Erreur fonction:", err)
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
