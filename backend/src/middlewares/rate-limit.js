"use strict";

const { RateLimiterMemory } = require("rate-limiter-flexible");

const rateLimiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
});

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.path.startsWith("/admin")) {
      return await next();
    }

    try {
      await rateLimiter.consume(ctx.ip);
      await next();
    } catch (err) {
      ctx.status = 429;
      ctx.body = {
        error: "Too many requests. Please wait a minute."
      };
    }
  };
};
