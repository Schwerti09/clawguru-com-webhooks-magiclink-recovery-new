import { NextResponse } from "next/server"

function stripeModeFromKey(k?: string | null) {
  if (!k) return "missing"
  if (k.startsWith("sk_live_")) return "live"
  if (k.startsWith("sk_test_")) return "test"
  return "present"
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || ""

  // Server-side only checks. Do NOT return actual secret values.
  const stripeKey = process.env.STRIPE_SECRET_KEY

  return NextResponse.json(
    {
      ok: true,
      now: new Date().toISOString(),
      siteUrl: siteUrl || null,
      env: {
        stripe: {
          keyMode: stripeModeFromKey(stripeKey),
          hasPricePro: Boolean(process.env.STRIPE_PRICE_PRO),
          hasPriceTeam: Boolean(process.env.STRIPE_PRICE_TEAM),
          hasPriceDaypass: Boolean(process.env.STRIPE_PRICE_DAYPASS),
          hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
        },
        copilot: {
          hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
          hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
        },
        admin: {
          hasAdminUser: Boolean(process.env.ADMIN_USERNAME),
          hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
          hasAdminSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
        },
        accessToken: {
          hasAccessTokenSecret: Boolean(process.env.ACCESS_TOKEN_SECRET || process.env.NEXTAUTH_SECRET),
        },
      },
    },
    { status: 200 },
  )
}
