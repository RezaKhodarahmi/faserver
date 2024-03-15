module.exports = {
  apps: [
    {
      name: "my-app",
      script: "server.js",
      env: {
        BASE_URL: "https://idtech.ca:3200",
        APP_URL: "https://fanavaran.ca",
        DASHBOARD_URL: "http://fanavaran:300",
        // BASE_URL: "http://idtech.ca:3200",
        // APP_URL: "https://idtech.ca",
        // DASHBOARD_URL: "https://dashboard.idtech.ca",
        // BASE_URL: "http://localhost:3200",
        // APP_URL: "http://localhost:3000",
        // DASHBOARD_URL: "http://localhost:3001",
        ACCESS_TOKEN_SECRET:
          "650f3e68dae094bf927206aa6bd30cc23d565ff2e9adddfd88e36a8765819469e53c8310e485fd2d9eae35a27ab58492c28bb15aa2ff15d82069e5b16eab3501",
        REFRESH_TOKEN_SECRET:
          "3b5d9944ff0f8741e19fae597340386daafbb58e7df29e4dbc84953037460ccb300a973d8efe8a375793e81cbe09e70deae8337ea6429e178256083c88d16e0c",
        PORT: 3200,
        SALT: 10,
        REFRESH_TOKEN_EXPIRES_TIME: "30*86400",
        ACCESS_TOKEN_EXPIRED_TIME: "100m",
        MAIL_HOST: "mail.fanavaran.ca",
        MAIL_PORT: 465,
        MAIL_USER: "test@fanavaran.ca",
        MAIL_PASSWORD: "U[@51$24x_%",
        STRIPE_PUBLIC_KEY:
          "pk_live_51HHFtaG5TuvsK0tsNRhJ7PHgkSK8BblevRKxH1fxgQfdg09Nh1VP86VJx39ZG4wf1YZVNoaicuBD9TbzqSMvpEsN00us1rpu0r",
        STRIPE_SECRET_KEY:
          "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",
        STRIPE_WEBHOOK_SECRET:
          "we_1OtV25G5TuvsK0tsLM41rRBl",
        REFERRAL_CREDIT: 20.0,
        STRIPE_MEMBERSHIP_PRICE_ID: "price_1OttYHG5TuvsK0tsRVUl4GbG",
        STRIPE_PRODUCT_PAYMENT_MODE: "subscription",
        TZ: "America/Toronto",
        NEXTAUTH_SECRET:
          "568df396ff5ede0dc62f1aab2662c17a65f65e6bea9611184b21f0de74f7336f",
        JWT_SECRET: "sddwgdjgwdjgefgejfekfjgj",
      },
      env_production: {
        // You can add production-specific environment variables here
      },
    },
  ],
};
