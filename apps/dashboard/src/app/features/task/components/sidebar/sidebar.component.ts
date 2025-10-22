import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
//   styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isDarkMode!: boolean;
  @Output() darkModeToggle = new EventEmitter<void>();
  @Output() logoutAction = new EventEmitter<void>();

  toggleDarkMode() {
    this.darkModeToggle.emit();
  }

  logout() {
    this.logoutAction.emit();
  }
}