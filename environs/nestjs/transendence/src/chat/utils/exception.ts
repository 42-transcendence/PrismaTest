import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomException extends HttpException {
	constructor(
		objectOrError? : string | object | any,
		description = 'Bad Access'
	) {
		super(
			HttpException.createBody(
				objectOrError,
				description,
				HttpStatus.BAD_REQUEST,
			),
			HttpStatus.BAD_REQUEST
		);
	}
}