import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ClothingItem, Outfit, OutfitPlan, UserProfile, FilterState } from '../types';
import { mockClothingItems, mockOutfits, mockOutfitPlans, mockUserProfile } from '../data/mockData';

interface WardrobeContextType {
  // Clothing Items
  clothingItems: ClothingItem[];
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  updateClothingItem: (id: string, updates: Partial<ClothingItem>) => void;
  deleteClothingItem: (id: string) => void;
  toggleFavoriteItem: (id: string) => void;

  // Outfits
  outfits: Outfit[];
  addOutfit: (outfit: Omit<Outfit, 'id' | 'createdAt'>) => void;
  updateOutfit: (id: string, updates: Partial<Outfit>) => void;
  deleteOutfit: (id: string) => void;
  toggleFavoriteOutfit: (id: string) => void;

  // Outfit Plans
  outfitPlans: OutfitPlan[];
  addOutfitPlan: (plan: Omit<OutfitPlan, 'id'>) => void;
  updateOutfitPlan: (id: string, updates: Partial<OutfitPlan>) => void;
  deleteOutfitPlan: (id: string) => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // UI State
  selectedItems: string[];
  toggleSelectItem: (id: string) => void;
  clearSelection: () => void;
}

const defaultFilters: FilterState = {
  category: 'all',
  season: 'all',
  occasion: 'all',
  color: 'all',
  search: '',
  favorites: false,
};

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: ReactNode }) {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(mockClothingItems);
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);
  const [outfitPlans, setOutfitPlans] = useState<OutfitPlan[]>(mockOutfitPlans);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Clothing Items
  const addClothingItem = useCallback((item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClothingItems(prev => [newItem, ...prev]);
  }, []);

  const updateClothingItem = useCallback((id: string, updates: Partial<ClothingItem>) => {
    setClothingItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteClothingItem = useCallback((id: string) => {
    setClothingItems(prev => prev.filter(item => item.id !== id));
    // Also remove from outfits
    setOutfits(prev =>
      prev.map(outfit => ({
        ...outfit,
        items: outfit.items.filter(itemId => itemId !== id),
      }))
    );
  }, []);

  const toggleFavoriteItem = useCallback((id: string) => {
    setClothingItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  }, []);

  // Outfits
  const addOutfit = useCallback((outfit: Omit<Outfit, 'id' | 'createdAt'>) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOutfits(prev => [newOutfit, ...prev]);
  }, []);

  const updateOutfit = useCallback((id: string, updates: Partial<Outfit>) => {
    setOutfits(prev =>
      prev.map(outfit => (outfit.id === id ? { ...outfit, ...updates } : outfit))
    );
  }, []);

  const deleteOutfit = useCallback((id: string) => {
    setOutfits(prev => prev.filter(outfit => outfit.id !== id));
  }, []);

  const toggleFavoriteOutfit = useCallback((id: string) => {
    setOutfits(prev =>
      prev.map(outfit =>
        outfit.id === id ? { ...outfit, isFavorite: !outfit.isFavorite } : outfit
      )
    );
  }, []);

  // Outfit Plans
  const addOutfitPlan = useCallback((plan: Omit<OutfitPlan, 'id'>) => {
    const newPlan: OutfitPlan = {
      ...plan,
      id: generateId(),
    };
    setOutfitPlans(prev => [...prev, newPlan]);
  }, []);

  const updateOutfitPlan = useCallback((id: string, updates: Partial<OutfitPlan>) => {
    setOutfitPlans(prev =>
      prev.map(plan => (plan.id === id ? { ...plan, ...updates } : plan))
    );
  }, []);

  const deleteOutfitPlan = useCallback((id: string) => {
    setOutfitPlans(prev => prev.filter(plan => plan.id !== id));
  }, []);

  // User Profile
  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);

  // Filters
  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  // Selection
  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  return (
    <WardrobeContext.Provider
      value={{
        clothingItems,
        addClothingItem,
        updateClothingItem,
        deleteClothingItem,
        toggleFavoriteItem,
        outfits,
        addOutfit,
        updateOutfit,
        deleteOutfit,
        toggleFavoriteOutfit,
        outfitPlans,
        addOutfitPlan,
        updateOutfitPlan,
        deleteOutfitPlan,
        userProfile,
        updateUserProfile,
        filters,
        setFilters,
        resetFilters,
        selectedItems,
        toggleSelectItem,
        clearSelection,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
}
