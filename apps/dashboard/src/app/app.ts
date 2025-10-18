import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  // standalone: true,
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  // styleUrl: './app.css',
})
export class App {
  protected title = 'dashboard';
}
