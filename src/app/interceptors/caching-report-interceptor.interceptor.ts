import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { of, tap } from 'rxjs';

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, CachedResponse>();

export const cachingReportInterceptorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (
    req.url.endsWith('/symptoms') ||
    req.url.endsWith('/tests') ||
    req.url.endsWith('/medicines')
  ) {
    const cachedResponse = cache.get(req.url);

    if (cachedResponse && isCacheValid(cachedResponse)) {
      return of(cachedResponse.response);
    }

    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          cache.set(req.url, {
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

interface CachedResponse {
  timestamp: number;
  response: HttpResponse<any>;
}

function isCacheValid(cachedResponse: CachedResponse): boolean {
  return Date.now() - cachedResponse.timestamp < CACHE_DURATION_MS;
}
