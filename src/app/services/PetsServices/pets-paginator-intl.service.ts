import { Injectable } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class PetsPaginatorIntlService extends MatPaginatorIntl{

  // constructor() { }
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    return `Page ${page + 1} of ${Math.ceil(length / pageSize)}`
  }
}
