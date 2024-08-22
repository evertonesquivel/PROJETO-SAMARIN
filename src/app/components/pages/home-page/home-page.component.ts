import { Component } from '@angular/core';
import { SectionComponent } from '../../section/section.component';
import { MainSectionComponent } from '../../main-section/main-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ SectionComponent,
    MainSectionComponent,],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
