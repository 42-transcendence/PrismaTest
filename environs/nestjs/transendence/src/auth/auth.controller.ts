import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { Request } from 'express';

// Reference: https://datatracker.ietf.org/doc/html/rfc6749

const authorization_endpoint = 'https://api.intra.42.fr/oauth/authorize';
const token_endpoint = 'https://api.intra.42.fr/oauth/token';
const __temporary__redirectUri = 'https://back/auth/callback';
const __temporary__scopes = ['public'];
const clientId = process.env.FT_API_USERID as string;
const clientSecret = process.env.FT_API_SECRET as string;

const stateMap = new Map<string, string>();

function getQueryParamOnly(req: Request, key: string): string | undefined {
  const value = req.query[key];
  if (!value) {
    return undefined;
  }

  if (typeof value !== 'string') {
    // throw new Error();
    return undefined;
  }

  return value;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect()
  startAuth(): { url: URL } {
    const redirectUri = __temporary__redirectUri;
    const scopes = __temporary__scopes;
    let state;
    do {
      state = crypto.randomUUID();
    } while (stateMap.has(state));
    stateMap.set(state, redirectUri);

    const authorizationUrl = new URL(authorization_endpoint);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('client_id', clientId);
    authorizationUrl.searchParams.set('redirect_uri', redirectUri);
    authorizationUrl.searchParams.set('scope', scopes.join(' '));
    authorizationUrl.searchParams.set('state', state);
    return { url: authorizationUrl };
  }

  @Get('callback')
  async callback(@Req() req: Request): Promise<string> {
    const state = getQueryParamOnly(req, 'state');
    if (!state) {
      throw new Error('invalid request: missing `state`');
    }

    const error = getQueryParamOnly(req, 'error');
    if (error) {
      const error_description = getQueryParamOnly(req, 'error_description');
      const error_uri = getQueryParamOnly(req, 'error_uri');

      error_description;
      error_uri;

      switch (error) {
        case 'invalid_request':
          `The request is missing a required parameter, includes an
          invalid parameter value, includes a parameter more than
          once, or is otherwise malformed.`;
          break;

        case 'unauthorized_client':
          `The client is not authorized to request an authorization
          code using this method.`;
          break;

        case 'access_denied':
          `The resource owner or authorization server denied the
          request.`;
          break;

        case 'unsupported_response_type':
          `The authorization server does not support obtaining an
          authorization code using this method.`;
          break;

        case 'invalid_scope':
          `The requested scope is invalid, unknown, or malformed.`;
          break;

        case 'server_error':
          `The authorization server encountered an unexpected
          condition that prevented it from fulfilling the request.
          (This error code is needed because a 500 Internal Server
          Error HTTP status code cannot be returned to the client
          via an HTTP redirect.)`;
          break;

        case 'temporarily_unavailable':
          `The authorization server is currently unable to handle
          the request due to a temporary overloading or maintenance
          of the server.  (This error code is needed because a 503
          Service Unavailable HTTP status code cannot be returned
          to the client via an HTTP redirect.)`;
          break;
      }

      return error;
    }

    const code = getQueryParamOnly(req, 'code');
    if (!code) {
      throw new Error('invalid request: missing `code`');
    }

    const redirectUri = stateMap.get(state);
    if (!redirectUri) {
      throw new Error('invalid state');
    }
    stateMap.delete(state);

    // Begin Fetch
    const method = 'POST';
    const headers: URLSearchParams = new URLSearchParams();
    const body: URLSearchParams = new URLSearchParams();

    headers.set(
      'content-type',
      'application/x-www-form-urlencoded;charset=UTF-8',
    );
    headers.set('accept', 'application/json');

    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', redirectUri);
    body.set('client_id', clientId);
    body.set('client_secret', clientSecret);

    const res: Response = await fetch(new URL(token_endpoint), {
      method,
      headers,
      body,
    });

    const tokenResponse = await res.json();

    if (res.ok) {
      if (!('access_token' in tokenResponse && 'token_type' in tokenResponse)) {
        throw new Error('unknown authorization server');
      }
      if ('expires_in' in tokenResponse) {
        //
      }
      if ('refresh_token' in tokenResponse) {
        //
      }
      if ('scope' in tokenResponse) {
        //
      }
    } else {
      tokenResponse._status = res.status;
      tokenResponse._statusText = res.statusText;
      if ('error' in tokenResponse) {
        switch (tokenResponse.error) {
          case 'invalid_request':
            `The request is missing a required parameter, includes an
            unsupported parameter value (other than grant type),
            repeats a parameter, includes multiple credentials,
            utilizes more than one mechanism for authenticating the
            client, or is otherwise malformed.`;
            break;

          case 'invalid_client':
            `Client authentication failed (e.g., unknown client, no
            client authentication included, or unsupported
            authentication method).  The authorization server MAY
            return an HTTP 401 (Unauthorized) status code to indicate
            which HTTP authentication schemes are supported.  If the
            client attempted to authenticate via the "Authorization"
            request header field, the authorization server MUST
            respond with an HTTP 401 (Unauthorized) status code and
            include the "WWW-Authenticate" response header field
            matching the authentication scheme used by the client.`;
            break;

          case 'invalid_grant':
            `The provided authorization grant (e.g., authorization
            code, resource owner credentials) or refresh token is
            invalid, expired, revoked, does not match the redirection
            URI used in the authorization request, or was issued to
            another client.`;
            break;

          case 'unauthorized_client':
            `The authenticated client is not authorized to use this
            authorization grant type.`;
            break;

          case 'unsupported_grant_type':
            `The authorization grant type is not supported by the
            authorization server.`;
            break;

          case 'invalid_scope':
            `The requested scope is invalid, unknown, malformed, or
            exceeds the scope granted by the resource owner.`;
            break;
        }

        tokenResponse.error_description;
        tokenResponse.error_uri;
      }
    }
    // End Fetch
    return tokenResponse;
  }

  @Get('refresh')
  async refresh(@Req() req: Request): Promise<string> {
    const refresh_token = getQueryParamOnly(req, 'refresh_token');
    if (!refresh_token) {
      return 'Usage: query `refresh_token`';
    }

    // Begin Fetch
    const method = 'POST';
    const headers: URLSearchParams = new URLSearchParams();
    const body: URLSearchParams = new URLSearchParams();

    headers.set(
      'content-type',
      'application/x-www-form-urlencoded;charset=UTF-8',
    );
    headers.set('accept', 'application/json');

    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refresh_token);
    // body.set('scope', scope); //TODO:

    const res: Response = await fetch(new URL(token_endpoint), {
      method,
      headers,
      body,
    });

    const tokenResponse = await res.json();

    if (res.ok) {
      if (!('access_token' in tokenResponse && 'token_type' in tokenResponse)) {
        throw new Error('unknown authorization server');
      }
      if ('expires_in' in tokenResponse) {
        //
      }
      if ('refresh_token' in tokenResponse) {
        //
      }
      if ('scope' in tokenResponse) {
        //
      }
    } else {
      tokenResponse._status = res.status;
      tokenResponse._statusText = res.statusText;
      if ('error' in tokenResponse) {
        switch (tokenResponse.error) {
          case 'invalid_request':
            `The request is missing a required parameter, includes an
            unsupported parameter value (other than grant type),
            repeats a parameter, includes multiple credentials,
            utilizes more than one mechanism for authenticating the
            client, or is otherwise malformed.`;
            break;

          case 'invalid_client':
            `Client authentication failed (e.g., unknown client, no
            client authentication included, or unsupported
            authentication method).  The authorization server MAY
            return an HTTP 401 (Unauthorized) status code to indicate
            which HTTP authentication schemes are supported.  If the
            client attempted to authenticate via the "Authorization"
            request header field, the authorization server MUST
            respond with an HTTP 401 (Unauthorized) status code and
            include the "WWW-Authenticate" response header field
            matching the authentication scheme used by the client.`;
            break;

          case 'invalid_grant':
            `The provided authorization grant (e.g., authorization
            code, resource owner credentials) or refresh token is
            invalid, expired, revoked, does not match the redirection
            URI used in the authorization request, or was issued to
            another client.`;
            break;

          case 'unauthorized_client':
            `The authenticated client is not authorized to use this
            authorization grant type.`;
            break;

          case 'unsupported_grant_type':
            `The authorization grant type is not supported by the
            authorization server.`;
            break;

          case 'invalid_scope':
            `The requested scope is invalid, unknown, malformed, or
            exceeds the scope granted by the resource owner.`;
            break;
        }

        tokenResponse.error_description;
        tokenResponse.error_uri;
      }
    }
    // End Fetch
    return tokenResponse;
  }
}