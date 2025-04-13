import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StatisticService } from '../services/statistic.service';
import { AuthenticationService } from '../services/authentication.service';

export const statisticResolver: ResolveFn<Object> = (route, state) => {
  const role = inject(AuthenticationService).getUserRole();
  const service = inject(StatisticService);
  return role === 'teacher' ? service.getStudents() : service.getStatistic();
};
