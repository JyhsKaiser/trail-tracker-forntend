import { Component } from "@angular/core";

@Component({
  selector: 'app-footer',
  standalone: true,
  // En Angular 21, al usar el nuevo Control Flow (@if), ya no necesitas CommonModule
  imports: [],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
