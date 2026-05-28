import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TEST_MODE = Deno.env.get('TEST_MODE') === 'true'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // pdfStoragePath = chemin dans le bucket "premium-pdfs", ex: "g7-fx-scoring.pdf"
    const { articleTitle, articleUrl, pdfStoragePath, userEmail } = await req.json()

    // Client admin (service role) — bypass RLS pour accéder au storage privé
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    if (!TEST_MODE) {
      const authHeader = req.headers.get('Authorization')!
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      )

      const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('plan')
        .single()

      if (error || profile?.plan !== 'premium') {
        return new Response(
          JSON.stringify({ error: 'Accès non autorisé' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const emailBody: {
      from: string;
      reply_to: string;
      to: string[];
      subject: string;
      html: string;
      attachments?: { content: string; filename: string }[];
    } = {
      from: 'Horacle Capital <noreply@horaclecapital.com>',
      reply_to: 'llombardini.leo@gmail.com',
      to: [userEmail],
      subject: `Votre recherche premium : ${articleTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
          <h2 style="border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">Horacle Capital — Recherche Premium</h2>
          <p>Bonjour,</p>
          <p>Votre document de recherche est disponible : <strong>${articleTitle}</strong>.</p>
          ${pdfStoragePath ? '<p>Le PDF est joint à cet email.</p>' : ''}
          <p>Consulter en ligne : <a href="${articleUrl}" style="color: #3b82f6;">${articleUrl}</a></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="font-size: 0.75rem; color: #6b7280;">Ce document est réservé aux abonnés premium Horacle Capital. Ne pas diffuser.</p>
        </div>
      `,
    }

    // Attacher le PDF depuis Supabase Storage (bucket privé)
    if (pdfStoragePath) {
      try {
        const { data, error } = await supabaseAdmin.storage
          .from('premium-pdfs')
          .download(pdfStoragePath)

        if (error) {
          console.error("Storage error:", error)
        } else if (data) {
          const arrayBuffer = await data.arrayBuffer()
          const bytes = new Uint8Array(arrayBuffer)
          let binary = ''
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          const base64Content = btoa(binary)
          const fileName = pdfStoragePath.split('/').pop() || 'recherche.pdf'
          emailBody.attachments = [{ content: base64Content, filename: fileName }]
        }
      } catch (err) {
        console.error("Erreur PDF storage:", err)
      }
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
