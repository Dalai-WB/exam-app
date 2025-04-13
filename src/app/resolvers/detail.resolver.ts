import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DetailService } from '../services/detail.service';

export const detailResolver: ResolveFn<Object> = (route, state) => {
  return inject(DetailService).getExamById(route.queryParams['id']);
};
