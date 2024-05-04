import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { of, tap } from 'rxjs';

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

export const cachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (
    req.url.endsWith('/symptoms') ||
    req.url.endsWith('/tests') ||
    req.url.endsWith('/medicines')
  ) {
    const cachedResponse = getCachedResponse(req.url);

    if (cachedResponse && isCacheValid(cachedResponse)) {
      console.log('Returning from cache');
      return of(cachedResponse.response);
    }

    return next(req).pipe(
      tap((event) => {
        console.log('Returning from API');

        if (event instanceof HttpResponse) {
          setCachedResponse(req.url, {
            timestamp: Date.now(),
            response: event,
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
  response: HttpResponse<any>;
}
