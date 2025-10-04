import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProfileService } from '../services/profile.service';

export const profileResolver: ResolveFn<Object> = (route, state) => {
  return inject(ProfileService).getUserProfile();
};
