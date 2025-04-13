import { CanDeactivateFn } from '@angular/router';
import { ExamCreateComponent } from '../components/exam-create/exam-create.component';

export const leaveCreateExamGuard: CanDeactivateFn<ExamCreateComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.isFinished) {
    return true;
  } else {
    return confirm(
      'Are you sure you want to leave this page? Your progress may be lost.'
    );
  }
};
