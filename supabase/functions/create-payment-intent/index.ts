import Stripe from 'https://esm.sh/stripe@14';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

serve(async (req) => {
  const { amount_dh, order_id } = await req.json();

  // Convert DH to cents (1 DH ≈ 10 MAD cents for Stripe)
  const amount = Math.round(amount_dh * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'mad',
    metadata: { order_id },
  });

  return new Response(
    JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});