import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

export class ActivatedRouteMock {
  private _params = new Subject<any>();

  get params() {
    return this._params.asObservable();
  }

  setParams(params: any) {
    this._params.next(params);
  }
}
