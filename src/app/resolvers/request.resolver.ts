import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RequestService } from '../services/request.service';

export const requestResolver: ResolveFn<Object> = (route, state) => {
  return inject(RequestService).getPendingRequests();
};
