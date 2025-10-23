// import { Component, Input, Output, EventEmitter } from '@angular/core';

// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html'
// //   styleUrls: ['./sidebar.component.css']
// })
// export class SidebarComponent {
//   @Input() isDarkMode!: boolean;
//   @Output() darkModeToggle = new EventEmitter<void>();
//   @Output() logoutAction = new EventEmitter<void>();

//   toggleDarkMode() {
//     this.darkModeToggle.emit();
//   }

//   logout() {
//     this.logoutAction.emit();
//   }
// }
import { Component, Input, Output, EventEmitter, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isDarkMode = false;
  @Output() logout = new EventEmitter<void>();

  activeRoute = '';

//   private router = Inject(Router);
  private router = inject(Router);

  ngOnInit() {
    // Get current route on init
    this.activeRoute = this.router.url;

    // Subscribe to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }
}