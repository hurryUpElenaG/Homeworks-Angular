import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-allowed',
  standalone: true,

  imports: [RouterLink],

  templateUrl: './not-allowed.component.html',
})
export class NotAllowedComponent {}
