// src/app/components/item-detail/item-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollectionItem } from '../../models/collection.interface';
import { CollectionService } from '../../services/collection.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
  // Add imports for standalone components
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
  // If you're not using standalone components, remove the imports property
  // and ensure these modules are imported in your app.module.ts
})
export class ItemDetailComponent implements OnInit {
  itemId!: number;
  item?: CollectionItem;
  itemForm!: FormGroup;
  isEditing: boolean = false;
  isNew: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe(params => {
      if (params['id'] === 'new') {
        // Creating a new item
        this.isNew = true;
        this.isEditing = true;
      } else {
        this.itemId = +params['id'];
        this.loadItem();
      }
    });
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      acquisitionDate: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      condition: ['mint', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['']
    });
  }

  loadItem(): void {
    this.collectionService.getItemById(this.itemId).subscribe(item => {
      if (item) {
        this.item = item;
        
        // Populate the form with item data
        this.itemForm.patchValue({
          name: item.name,
          category: item.category,
          acquisitionDate: this.formatDate(item.acquisitionDate),
          value: item.value,
          condition: item.condition,
          description: item.description,
          imageUrl: item.imageUrl || ''
        });
      } else {
        // Item not found, redirect to list
        this.router.navigate(['/items']);
      }
    });
  }

  // Format date for the input field (YYYY-MM-DD)
  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    
    if (!this.isEditing && this.item) {
      // Reset form to current item values when canceling edit
      this.itemForm.patchValue({
        name: this.item.name,
        category: this.item.category,
        acquisitionDate: this.formatDate(this.item.acquisitionDate),
        value: this.item.value,
        condition: this.item.condition,
        description: this.item.description,
        imageUrl: this.item.imageUrl || ''
      });
    }
  }

  saveItem(): void {
    if (this.itemForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.itemForm.controls).forEach(key => {
        this.itemForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.itemForm.value;
    const savedItem: CollectionItem = {
      id: this.isNew ? 0 : this.itemId, // ID will be assigned by service if new
      name: formData.name,
      category: formData.category,
      acquisitionDate: new Date(formData.acquisitionDate),
      value: +formData.value,
      condition: formData.condition,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined
    };

    if (this.isNew) {
      this.collectionService.addItem(savedItem);
      this.router.navigate(['/items']);
    } else {
      this.collectionService.updateItem(savedItem);
      this.item = savedItem;
      this.isEditing = false;
    }
  }

  deleteItem(): void {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      this.collectionService.deleteItem(this.itemId);
      this.router.navigate(['/items']);
    }
  }

  goBack(): void {
    this.router.navigate(['/items']);
  }
}