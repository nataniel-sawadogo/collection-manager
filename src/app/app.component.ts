// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // Add imports for standalone components
  imports: [CommonModule, RouterModule],
  // Alternatively, you can use the below if you're not using standalone components
  // and make sure RouterModule is imported in app.module.ts
  // standalone: false
})
export class AppComponent implements OnInit {
  title = 'Collection Manager';
  currentYear: number = new Date().getFullYear();
  
  ngOnInit(): void {
    // Any initialization code if needed
  }
}