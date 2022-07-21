require('dotenv').config();

interface Api {
  STRIPE_API_KEY: string | undefined;
}

const apiKey: Api = {
  STRIPE_API_KEY: process.env.STRIPE_API_KEY,
};

export default apiKey;
