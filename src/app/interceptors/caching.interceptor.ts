import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { of, tap } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { inject } from '@angular/core';
import { CryptoJSServiceService } from '../services/CryptoJS/crypto-jsservice.service';

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

export const cachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const _cryptojsService = inject(CryptoJSServiceService);

  if (
    req.method === 'GET' &&
    (req.url.endsWith('/symptoms') ||
      req.url.endsWith('/tests') ||
      req.url.endsWith('/medicines'))
  ) {
    const cachedResponse = getCachedResponse(req.url);

    if (cachedResponse && isCacheValid(cachedResponse)) {
      //console.log('Returning from cache');
      const decryptedResponse = _cryptojsService.decrypt(
        cachedResponse.response
      );
      return of(
        new HttpResponse<any>({ body: decryptedResponse, status: 200 })
      );
    }

    return next(req).pipe(
      tap((event) => {
        // console.log('Returning from API');

        if (event instanceof HttpResponse) {
          const encryptedResponse = _cryptojsService.encrypt(event.body);
          setCachedResponse(req.url, {
            timestamp: Date.now(),
            response: encryptedResponse,
          });
        }
      })
    );
  } else {
    return next(req);
  }
};

function getCachedResponse(url: string): CachedResponse | null {
  const cachedData = localStorage.getItem(getCacheKey(url));
  return cachedData ? JSON.parse(cachedData) : null;
}

function setCachedResponse(url: string, cachedResponse: CachedResponse): void {
  localStorage.setItem(getCacheKey(url), JSON.stringify(cachedResponse));
}

function isCacheValid(cachedResponse: CachedResponse): boolean {
  return Date.now() - cachedResponse.timestamp < CACHE_DURATION_MS;
}

function getCacheKey(url: string): string {
  return `cache-${url}`;
}

interface CachedResponse {
  timestamp: number;
  response: string;
}
