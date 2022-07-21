import Stripe from 'stripe';

// Creating an instance of Stripe Class and Exporting it
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27',
});