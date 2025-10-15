import { CanDeactivateFn } from '@angular/router';
import { DetailComponent } from '../components/detail/detail.component';

export const leaveExamGuard: CanDeactivateFn<DetailComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.isExamEnded) return true;

  const leave = confirm(
    'Та сорилоос гарахдаа итгэлтэй байна уу? Одоог хүртэл өгсөн таны хариултуудын дагуу оноо тооцогдох болно.'
  );

  if (leave) {
    // 1️⃣ Save exam responses
    component.saveResponses();

    // 2️⃣ If navigating to home page, force full reload
    const nextUrl = nextState?.url;
    if (nextUrl === '/home' || nextUrl?.startsWith('/home')) {
      window.location.href = '/home';
      return false; // cancel Angular route since browser will handle navigation
    }
  }

  return leave;
};
