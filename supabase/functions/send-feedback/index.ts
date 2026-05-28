import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TARGET_EMAIL = 'llombardini.leo@gmail.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userEmail, feedbackType, message, pageUrl } = await req.json()

    if (!userEmail || !message) {
      return new Response(
        JSON.stringify({ error: 'Email et message requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailBody = {
      from: 'Horacle Capital Feedback <noreply@horaclecapital.com>',
      reply_to: userEmail,
      to: [TARGET_EMAIL],
      subject: `[FEEDBACK] Nouveau retour de ${userEmail} (${feedbackType})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e; border: 1px solid #e5e7eb; padding: 24px;">
          <h2 style="border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-top: 0;">Nouveau Feedback</h2>
          
          <div style="margin-bottom: 20px;">
            <p style="margin: 0; color: #6b7280; font-size: 0.8rem; text-transform: uppercase;">Expéditeur</p>
            <p style="margin: 4px 0 0 0; font-weight: bold;">${userEmail}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="margin: 0; color: #6b7280; font-size: 0.8rem; text-transform: uppercase;">Type de retour</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; color: #3b82f6;">${feedbackType.toUpperCase()}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <p style="margin: 0; color: #6b7280; font-size: 0.8rem; text-transform: uppercase;">Message</p>
            <div style="margin: 8px 0 0 0; padding: 16px; background-color: #f9fafb; border-radius: 4px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          
          <div style="color: #9ca3af; font-size: 0.75rem;">
            <p style="margin: 0;">Page source : ${pageUrl}</p>
            <p style="margin: 4px 0 0 0;">Envoyé le : ${new Date().toLocaleString('fr-FR')}</p>
          </div>
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
