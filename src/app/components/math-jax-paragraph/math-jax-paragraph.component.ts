import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MathJaxService } from '../../services/math-jax.service';

@Component({
  selector: 'app-math-jax-paragraph',
  templateUrl: './math-jax-paragraph.component.html',
  styleUrls: [],
})
export class MathJaxParagraphComponent implements OnChanges {
  @ViewChild('mathParagraph') paragraphElement: ElementRef | undefined;
  @Input() mathString!: string;

  constructor(private mathJaxService: MathJaxService) {}

  ngOnInit() {
    this.mathJaxService.getMathJaxLoadedPromise().then(() => {
      this.renderMath();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mathString'] && !changes['mathString'].isFirstChange()) {
      this.renderMath();
    }
  }

  renderMath() {
    if (this.paragraphElement && this.mathString) {
      this.paragraphElement.nativeElement.innerHTML = this.mathString;
      this.mathJaxService.render(this.paragraphElement.nativeElement);
    }
  }
}
