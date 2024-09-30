import { Component } from '@angular/core';
import { MultiStepFormComponent } from '../../multi-step-form/multi-step-form.component';
@Component({
  selector: 'app-create-account-page',
  standalone: true,
  imports: [MultiStepFormComponent],
  templateUrl: './create-account-page.component.html',
  styleUrl: './create-account-page.component.css'
})
export class CreateAccountPageComponent {

}
