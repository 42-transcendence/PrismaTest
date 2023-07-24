import * as joi from 'joi';

export const validationSchema = joi.object({
	EMAIL_SERVICE: joi.string().required(),
	EMAIL_AUTH_USER: joi.string().required(),
	EMAIL_AUTH_PASSWORD: joi.string().required(),
	EMAIL_BASE_URL: joi.string().required().uri(),
})