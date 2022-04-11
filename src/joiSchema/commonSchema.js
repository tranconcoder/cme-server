const Joi = require("joi");

module.exports = {
	googleId: Joi.string().length(21).required(),
	mongoDbId: Joi.string().length(24).required(),
};
