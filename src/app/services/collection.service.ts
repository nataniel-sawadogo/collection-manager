import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionItem } from '../models/collection.interface';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private items: CollectionItem[] = [
    {
      id: 1,
      name: '1909-S VDB Lincoln Cent',
      category: 'Coins',
      acquisitionDate: new Date('2022-05-15'),
      value: 1500,
      condition: 'good',
      description: 'Rare Lincoln penny with V.D.B. initials on the reverse, San Francisco mint.',
      imageUrl: '/lincoln_cent.jpg'
    },
    {
      id: 2,
      name: 'Inverted Jenny',
      category: 'Stamps',
      acquisitionDate: new Date('2023-01-10'),
      value: 9500,
      condition: 'mint',
      description: 'Famous U.S. postage stamp with an upside-down airplane, from 1918.',
      imageUrl: 'inverted_jenny.jpg'
    },
    {
      id: 3,
      name: '1804 Silver Dollar',
      category: 'Coins',
      acquisitionDate: new Date('2021-11-20'),
      value: 3800,
      condition: 'fair',
      description: 'Known as "The King of American Coins", extremely rare silver dollar.',
      imageUrl: '/dollar_1804.jpeg'
    }
  ];

  private collectionSubject = new BehaviorSubject<CollectionItem[]>(this.items);

  constructor() {}

  getItems(): Observable<CollectionItem[]> {
    return this.collectionSubject.asObservable();
  }

  getItemById(id: number): Observable<CollectionItem | undefined> {
    return new Observable<CollectionItem | undefined>(observer => {
      observer.next(this.items.find(item => item.id === id));
      observer.complete();
    });
  }

  addItem(item: CollectionItem): void {
    // Generate new ID based on the highest existing ID
    const newId = this.items.length > 0 
      ? Math.max(...this.items.map(i => i.id)) + 1 
      : 1;
    
    const newItem = { ...item, id: newId };
    this.items = [...this.items, newItem];
    this.collectionSubject.next(this.items);
  }

  updateItem(updatedItem: CollectionItem): void {
    this.items = this.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    this.collectionSubject.next(this.items);
  }

  deleteItem(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
    this.collectionSubject.next(this.items);
  }
}