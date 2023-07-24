import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthService } from "./auth/auth.service";

// @Injectable()
// export class AuthGuard implements CanActivate {
// 	constructor(private authService: AuthService) {}
// 	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
// 		const request = context.switchToHttp().getRequest();
// 		return this.vaildRequest(request);
// 	}

// 	private vaildRequest(request: Request) {
// 		const jwtString = request.headers.authorization.split('Bearer ')[1];
		
// 		this.authService.verify(jwtString);

// 		return true;
// 	}
// }

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		return this.vaildRequest(request);
	}

	private vaildRequest(request: Request) {
		const jwtString = request.headers.authorization.split('Bearer ')[1];
		
		this.authService.verify(jwtString);

		return true;
	}
}