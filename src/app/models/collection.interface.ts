export interface CollectionItem {
  id: number;
  name: string;
  category: string;
  acquisitionDate: Date;
  value: number;
  condition: 'mint' | 'good' | 'fair' | 'poor';
  description: string;
  imageUrl?: string;
}