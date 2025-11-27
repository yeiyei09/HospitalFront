import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio-list.component.html',
  styleUrls: ['./inicio-list.component.scss'],
})
export class InicioComponent {
  usuario = localStorage.getItem('user_data')
    ? JSON.parse(localStorage.getItem('user_data')!)
    : null;
}