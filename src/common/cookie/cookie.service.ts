import { Injectable } from "@nestjs/common";
import { HttpCookies } from "@common/cookie/http-cookies.enum";
import { getCookieOptions } from "@common/cookie/cookie-options";
import { Response } from 'express';

@Injectable()
export class CookieService {

    setAccessToken(
        response: Response,
        token: string,
        rememberMe = false,
    ) {
        response.cookie(
            HttpCookies.AccessToken,
            token,
            getCookieOptions(rememberMe),
        );
    }

    setRefreshToken(
        response: Response,
        token: string,
        rememberMe = false,
    ) {
        response.cookie(
            HttpCookies.RefreshToken,
            token,
            getCookieOptions(rememberMe),
        );
    }

    clearTokens(response: Response) {
        response.clearCookie(
            HttpCookies.AccessToken,
            getCookieOptions(),
        );

        response.clearCookie(
            HttpCookies.RefreshToken,
            getCookieOptions(),
        );
    }
}