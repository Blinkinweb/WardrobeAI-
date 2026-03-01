export type ClothingCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'activewear'
  | 'formal';

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all';

export type Occasion =
  | 'casual'
  | 'work'
  | 'formal'
  | 'sport'
  | 'party'
  | 'date'
  | 'outdoor';

export type Color =
  | 'black'
  | 'white'
  | 'gray'
  | 'navy'
  | 'blue'
  | 'red'
  | 'pink'
  | 'purple'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'brown'
  | 'beige'
  | 'multicolor';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: Color;
  seasons: Season[];
  occasions: Occasion[];
  brand?: string;
  size?: string;
  imageUrl?: string;
  imageColor?: string; // fallback color for display
  tags: string[];
  timesWorn: number;
  lastWorn?: string; // ISO date string
  purchaseDate?: string; // ISO date string
  price?: number;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: string[]; // ClothingItem IDs
  occasions: Occasion[];
  seasons: Season[];
  rating?: number;
  notes?: string;
  lastWorn?: string;
  timesWorn: number;
  isFavorite: boolean;
  createdAt: string;
  aiGenerated?: boolean;
}

export interface OutfitPlan {
  id: string;
  date: string; // ISO date string
  outfitId?: string;
  customItems?: string[]; // ClothingItem IDs
  occasion?: Occasion;
  notes?: string;
  weather?: string;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  style: string[];
  bodyType?: string;
  preferredColors: Color[];
  preferredOccasions: Occasion[];
  location?: string;
}

export interface AIOutfitSuggestion {
  id: string;
  outfit: Outfit;
  reason: string;
  weatherMatch?: string;
  occasionMatch: Occasion;
  styleScore: number;
  items: ClothingItem[];
}

export type ViewMode = 'grid' | 'list';

export interface FilterState {
  category: ClothingCategory | 'all';
  season: Season | 'all';
  occasion: Occasion | 'all';
  color: Color | 'all';
  search: string;
  favorites: boolean;
}
