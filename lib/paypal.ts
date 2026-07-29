/**
 * Thin wrapper around the PayPal REST API (Orders v2).
 * Set PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET in .env, and PAYPAL_ENV to
 * "sandbox" while testing or "live" once you're ready to take real payments
 * through your PayPal Business account.
 */

const BASE_URL =
  process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error('Failed to authenticate with PayPal');
  const data = await res.json();
  return data.access_token;
}

export async function createPaypalOrder(amountUSD: string, orderNumber: string) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderNumber,
          amount: { currency_code: 'USD', value: amountUSD },
          description: 'The Global Scam Economy — Full Report',
        },
      ],
      application_context: {
        brand_name: 'INFO',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    }),
  });

  if (!res.ok) throw new Error('Failed to create PayPal order');
  return res.json();
}

export async function capturePaypalOrder(paypalOrderId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to capture PayPal order');
  return res.json();
}

/**
 * Verifies an incoming webhook actually came from PayPal.
 * Requires PAYPAL_WEBHOOK_ID (created in your PayPal Developer Dashboard).
 */
export async function verifyPaypalWebhook(headers: Headers, body: any) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: headers.get('paypal-auth-algo'),
      cert_url: headers.get('paypal-cert-url'),
      transmission_id: headers.get('paypal-transmission-id'),
      transmission_sig: headers.get('paypal-transmission-sig'),
      transmission_time: headers.get('paypal-transmission-time'),
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: body,
    }),
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.verification_status === 'SUCCESS';
}
