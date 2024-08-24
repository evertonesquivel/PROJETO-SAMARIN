import { Component } from '@angular/core';
import { NavigationService } from '../../services/navigation.service'; // Verifique o caminho correto

@Component({
  selector: 'app-header',
  standalone : true ,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private navigationService: NavigationService) {}

  navigateToLogin() {
    this.navigationService.navigateToLogin();
  }
}
