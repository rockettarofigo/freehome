import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isMobile = false;
  showBackButton = false;

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.checkWidth();
    window.addEventListener('resize', () => this.checkWidth());

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showBackButton = event.urlAfterRedirects !== '/dashboard';
    });
  }

  private checkWidth() {
    this.isMobile = window.innerWidth < 992;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
