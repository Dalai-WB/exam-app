import { TestBed } from '@angular/core/testing';
import { MathJaxService } from './math-jax.service';

describe('MathJaxService', () => {
  let service: MathJaxService;
  let mockElement: HTMLElement;

  beforeEach(() => {
    (window as any).MathJax = {
      startup: { promise: Promise.resolve() },
      typesetClear: jasmine.createSpy('typesetClear'),
      typesetPromise: jasmine.createSpy('typesetPromise').and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({});
    service = TestBed.inject(MathJaxService);
    mockElement = document.createElement('p');
  });

  it('should call typesetClear with the provided element', async () => {
    await service.render(mockElement);
    expect((window as any).MathJax.typesetClear).toHaveBeenCalledWith([mockElement]);
  });

  it('should call typesetPromise with the provided element', async () => {
    await service.render(mockElement);
    expect((window as any).MathJax.typesetPromise).toHaveBeenCalledWith([mockElement]);
  });

  it('should call typesetClear before typesetPromise', async () => {
    const callOrder: string[] = [];
    (window as any).MathJax.typesetClear.and.callFake(() => callOrder.push('clear'));
    (window as any).MathJax.typesetPromise.and.callFake(() => { callOrder.push('typeset'); return Promise.resolve(); });

    await service.render(mockElement);

    expect(callOrder).toEqual(['clear', 'typeset']);
  });
});
