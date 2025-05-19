// src/app/components/item-list/item-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CollectionItem } from '../../models/collection.interface';
import { CollectionService } from '../../services/collection.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  // Add imports for standalone components
  imports: [CommonModule, RouterModule, FormsModule]
  // If you're not using standalone components, remove the imports property
  // and ensure these modules are imported in your app.module.ts
})
export class ItemListComponent implements OnInit {
  items: CollectionItem[] = [];
  filteredItems: CollectionItem[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.collectionService.getItems().subscribe(items => {
      this.items = items;
      this.filteredItems = items;
      
      // Extract unique categories
      this.categories = Array.from(new Set(items.map(item => item.category)));
    });
  }

  applyFilters(): void {
    this.filteredItems = this.items.filter(item => {
      // Apply search term filter (case insensitive)
      const matchesSearch = this.searchTerm === '' || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Apply category filter
      const matchesCategory = this.selectedCategory === '' || 
        item.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.filteredItems = this.items;
  }

  getTotalValue(): number {
    return this.items.reduce((sum, item) => sum + item.value, 0);
  }

  getFilteredValue(): number {
    return this.filteredItems.reduce((sum, item) => sum + item.value, 0);
  }
}