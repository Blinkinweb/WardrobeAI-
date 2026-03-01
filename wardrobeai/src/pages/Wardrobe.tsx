import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import Header from '../components/layout/Header';
import ClothingCard from '../components/wardrobe/ClothingCard';
import ClothingItemModal from '../components/wardrobe/ClothingItemModal';
import type { ClothingItem, ClothingCategory, Season, Occasion, Color } from '../types';

interface OutletContext {
  onMenuClick: () => void;
}

const categories: (ClothingCategory | 'all')[] = ['all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'activewear', 'formal'];
const seasons: (Season | 'all')[] = ['all', 'spring', 'summer', 'fall', 'winter'];
const occasions: (Occasion | 'all')[] = ['all', 'casual', 'work', 'formal', 'sport', 'party', 'date', 'outdoor'];
const colors: (Color | 'all')[] = ['all', 'black', 'white', 'gray', 'navy', 'blue', 'red', 'pink', 'purple', 'green', 'yellow', 'orange', 'brown', 'beige', 'multicolor'];

const colorHex: Record<string, string> = {
  black: '#111827', white: '#f9fafb', gray: '#9ca3af', navy: '#1e3a5f',
  blue: '#3b82f6', red: '#ef4444', pink: '#ec4899', purple: '#a855f7',
  green: '#22c55e', yellow: '#eab308', orange: '#f97316', brown: '#92400e',
  beige: '#d4a76a', multicolor: 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)',
};

export default function Wardrobe() {
  const { onMenuClick } = useOutletContext<OutletContext>();
  const { clothingItems, filters, setFilters, resetFilters } = useWardrobe();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ClothingItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    return clothingItems.filter(item => {
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.season !== 'all' && !item.seasons.includes(filters.season as Season) && !item.seasons.includes('all')) return false;
      if (filters.occasion !== 'all' && !item.occasions.includes(filters.occasion as Occasion)) return false;
      if (filters.color !== 'all' && item.color !== filters.color) return false;
      if (filters.favorites && !item.isFavorite) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!item.name.toLowerCase().includes(search) &&
            !item.brand?.toLowerCase().includes(search) &&
            !item.tags.some(t => t.toLowerCase().includes(search))) return false;
      }
      return true;
    });
  }, [clothingItems, filters]);

  const activeFilterCount = [
    filters.category !== 'all',
    filters.season !== 'all',
    filters.occasion !== 'all',
    filters.color !== 'all',
    filters.favorites,
  ].filter(Boolean).length;

  const handleEdit = (item: ClothingItem) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={onMenuClick}
        title="My Wardrobe"
        subtitle={`${filteredItems.length} of ${clothingItems.length} items`}
        onAddClick={() => { setEditItem(null); setShowModal(true); }}
        addLabel="Add Item"
      />

      <div className="p-4 lg:p-6">
        {/* Search & Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, brands, tags..."
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors
              ${showFilters || activeFilterCount > 0
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-purple-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Quick Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilters({ category: cat })}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium capitalize transition-all
                ${filters.category === cat
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => { resetFilters(); setShowFilters(false); }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Reset all
              </button>
            </div>

            {/* Season */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Season</label>
              <div className="flex flex-wrap gap-2">
                {seasons.map(season => (
                  <button
                    key={season}
                    onClick={() => setFilters({ season })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                      ${filters.season === season
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {season === 'all' ? 'All Seasons' : season}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Occasion</label>
              <div className="flex flex-wrap gap-2">
                {occasions.map(occ => (
                  <button
                    key={occ}
                    onClick={() => setFilters({ occasion: occ })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                      ${filters.occasion === occ
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {occ === 'all' ? 'All Occasions' : occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ color: 'all' })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${filters.color === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  All Colors
                </button>
                {colors.filter(c => c !== 'all').map(color => (
                  <button
                    key={color}
                    onClick={() => setFilters({ color })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                      ${filters.color === color ? 'ring-2 ring-purple-500 ring-offset-1' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ background: color === 'multicolor' ? 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)' : colorHex[color] }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilters({ favorites: !filters.favorites })}
                className={`relative w-10 h-5 rounded-full transition-colors ${filters.favorites ? 'bg-pink-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.favorites ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-gray-700">Show favorites only</span>
            </div>
          </div>
        )}

        {/* Items Grid/List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">
              {clothingItems.length === 0
                ? "Your wardrobe is empty. Start adding your clothes!"
                : "Try adjusting your filters to find what you're looking for."
              }
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-purple-600 font-medium hover:text-purple-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map(item => (
              <ClothingCard key={item.id} item={item} onEdit={handleEdit} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map(item => (
              <ClothingCard key={item.id} item={item} onEdit={handleEdit} viewMode="list" />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ClothingItemModal item={editItem} onClose={handleCloseModal} />
      )}
    </div>
  );
}
