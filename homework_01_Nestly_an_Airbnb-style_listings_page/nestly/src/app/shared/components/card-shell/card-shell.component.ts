import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-shell',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './card-shell.component.html',
})
export class CardShellComponent {}