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
      'Та сорилоос гарахдаа итгэлтэй байна уу? Одоог хүртэл өгсөн таны хариултуудын дагуу оноо тооцогдох болно.'
    );
  }
};
