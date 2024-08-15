import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Section {
  title: string;
  links: string[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  sections: Section[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ sections: Section[] }>('assets/links.json').subscribe(data => {
      this.sections = data.sections;
    });
  }
}
