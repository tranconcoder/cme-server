const Joi = require("joi");
const { googleId, mongoDbId } = require("./commonSchema");

const studentInfoSchema = Joi.object().keys({
	id: [Joi.any()],
	index: Joi.number().min(1).required(),
	name: Joi.string().required(),
	googleName: Joi.string().required(),
	email: [Joi.string().email(), Joi.string()],
});

const requestClassInfoSchema = Joi.object().keys({
	googleId,
	classInfoIdToAdd: mongoDbId,
	studentInfoToAdd: studentInfoSchema,
	passwordToAdd: Joi.string().min(0).required(),
});

const requestCheckOnlineFormPassword = Joi.object().keys({
	googleId,
	classInfoId: mongoDbId,
	classInfoPassword: Joi.string().required(),
});

const requestChangeOnlineFormPassword = Joi.object().keys({
	oldPassword: Joi.string().min(0).required(),
	newPassword: Joi.string().min(0).required(),
});

const requestCheckUniqueInfo = Joi.object().keys({
	googleId,
	classInfoId: mongoDbId,
	index: Joi.number(),
	googleName: Joi.string().min(0),
	email: Joi.string().min(0),
});

module.exports = {
	requestClassInfoSchema,
	requestCheckOnlineFormPassword,
	requestChangeOnlineFormPassword,
	requestCheckUniqueInfo,
};
