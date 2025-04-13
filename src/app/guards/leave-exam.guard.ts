import { CanDeactivateFn } from '@angular/router';
import { DetailComponent } from '../components/detail/detail.component';

export const leaveExamGuard: CanDeactivateFn<DetailComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.isExamEnded) {
    return true;
  } else {
    return confirm(
      'Are you sure you want to leave this page? Your progress may be lost.'
    );
  }
};
