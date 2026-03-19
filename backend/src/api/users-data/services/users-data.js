'use strict';

/**
 * users-data service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::users-data.users-data');
