import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Heart, Star, Trash2, Edit2, Plus, X, Check } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import Header from '../components/layout/Header';
import type { Outfit, ClothingItem, Occasion, Season } from '../types';

interface OutletContext {
  onMenuClick: () => void;
}

const categoryEmoji: Record<string, string> = {
  tops: '👕', bottoms: '👖', dresses: '👗', outerwear: '🧥',
  shoes: '👟', accessories: '💍', activewear: '🏃', formal: '👔',
};

const occasionColors: Record<string, string> = {
  casual: 'bg-blue-100 text-blue-700',
  work: 'bg-green-100 text-green-700',
  formal: 'bg-purple-100 text-purple-700',
  sport: 'bg-orange-100 text-orange-700',
  party: 'bg-pink-100 text-pink-700',
  date: 'bg-red-100 text-red-700',
  outdoor: 'bg-teal-100 text-teal-700',
};

interface OutfitCardProps {
  outfit: Outfit;
  items: ClothingItem[];
  onEdit: (outfit: Outfit) => void;
}

function OutfitCard({ outfit, items, onEdit }: OutfitCardProps) {
  const { toggleFavoriteOutfit, deleteOutfit } = useWardrobe();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Items preview */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <div className="flex items-center gap-2 flex-wrap">
          {items.slice(0, 4).map(item => (
            <div
              key={item.id}
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm"
              style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
            >
              {categoryEmoji[item.category] || '👕'}
            </div>
          ))}
          {items.length > 4 && (
            <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
              +{items.length - 4}
            </div>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={() => toggleFavoriteOutfit(outfit.id)}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all
            ${outfit.isFavorite
              ? 'bg-white text-pink-500 shadow-md'
              : 'bg-white/70 text-gray-400 opacity-0 group-hover:opacity-100'
            }`}
        >
          <Heart className="w-4 h-4" fill={outfit.isFavorite ? 'currentColor' : 'none'} />
        </button>

        {outfit.aiGenerated && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            ✨ AI
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900">{outfit.name}</h3>
          {outfit.rating && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3"
                  fill={i < outfit.rating! ? '#f59e0b' : 'none'}
                  stroke={i < outfit.rating! ? '#f59e0b' : '#d1d5db'}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {outfit.occasions.slice(0, 2).map(occ => (
            <span key={occ} className={`text-xs px-2 py-0.5 rounded-full font-medium ${occasionColors[occ] || 'bg-gray-100 text-gray-600'}`}>
              {occ}
            </span>
          ))}
          {outfit.seasons.slice(0, 2).map(season => (
            <span key={season} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
              {season}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{items.length} items • Worn {outfit.timesWorn}x</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(outfit)}
              className="p-1.5 rounded-lg hover:bg-purple-50 hover:text-purple-500 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteOutfit(outfit.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OutfitBuilderModalProps {
  outfit?: Outfit | null;
  onClose: () => void;
}

function OutfitBuilderModal({ outfit, onClose }: OutfitBuilderModalProps) {
  const { clothingItems, addOutfit, updateOutfit } = useWardrobe();
  const [name, setName] = useState(outfit?.name || '');
  const [selectedItems, setSelectedItems] = useState<string[]>(outfit?.items || []);
  const [occasions, setOccasions] = useState<Occasion[]>(outfit?.occasions || []);
  const [seasons, setSeasons] = useState<Season[]>(outfit?.seasons || []);
  const [notes, setNotes] = useState(outfit?.notes || '');
  const [searchQuery, setSearchQuery] = useState('');

  const allOccasions: Occasion[] = ['casual', 'work', 'formal', 'sport', 'party', 'date', 'outdoor'];
  const allSeasons: Season[] = ['spring', 'summer', 'fall', 'winter', 'all'];

  const filteredClothingItems = clothingItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleOccasion = (occ: Occasion) => {
    setOccasions(prev => prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]);
  };

  const toggleSeason = (season: Season) => {
    setSeasons(prev => prev.includes(season) ? prev.filter(s => s !== season) : [...prev, season]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedItems.length === 0) return;

    const outfitData = {
      name: name.trim(),
      items: selectedItems,
      occasions: occasions.length > 0 ? occasions : ['casual' as Occasion],
      seasons: seasons.length > 0 ? seasons : ['all' as Season],
      notes: notes.trim() || undefined,
      timesWorn: outfit?.timesWorn || 0,
      isFavorite: outfit?.isFavorite || false,
    };

    if (outfit) {
      updateOutfit(outfit.id, outfitData);
    } else {
      addOutfit(outfitData);
    }
    onClose();
  };

  const selectedClothingItems = clothingItems.filter(i => selectedItems.includes(i.id));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {outfit ? 'Edit Outfit' : 'Create Outfit'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Outfit Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Office Chic, Weekend Casual"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>

            {/* Selected items preview */}
            {selectedClothingItems.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selected Items ({selectedClothingItems.length})</label>
                <div className="flex flex-wrap gap-2">
                  {selectedClothingItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5">
                      <span className="text-sm">{categoryEmoji[item.category]}</span>
                      <span className="text-xs font-medium text-purple-700 truncate max-w-24">{item.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="text-purple-400 hover:text-purple-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Item selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Add Items *</label>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-100 rounded-xl p-2">
                {filteredClothingItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors
                      ${selectedItems.includes(item.id) ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
                    >
                      {categoryEmoji[item.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                    </div>
                    {selectedItems.includes(item.id) && (
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Occasions</label>
              <div className="flex flex-wrap gap-2">
                {allOccasions.map(occ => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleOccasion(occ)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                      ${occasions.includes(occ) ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Seasons */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Seasons</label>
              <div className="flex flex-wrap gap-2">
                {allSeasons.map(season => (
                  <button
                    key={season}
                    type="button"
                    onClick={() => toggleSeason(season)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                      ${seasons.includes(season) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any notes about this outfit..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim() || selectedItems.length === 0}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {outfit ? 'Save Changes' : 'Create Outfit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Outfits() {
  const { onMenuClick } = useOutletContext<OutletContext>();
  const { outfits, clothingItems } = useWardrobe();
  const [showModal, setShowModal] = useState(false);
  const [editOutfit, setEditOutfit] = useState<Outfit | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const displayedOutfits = activeTab === 'favorites'
    ? outfits.filter(o => o.isFavorite)
    : outfits;

  const getOutfitItems = (outfit: Outfit) =>
    outfit.items.map(id => clothingItems.find(i => i.id === id)).filter(Boolean) as ClothingItem[];

  const handleEdit = (outfit: Outfit) => {
    setEditOutfit(outfit);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={onMenuClick}
        title="Outfits"
        subtitle={`${outfits.length} outfit combinations`}
        onAddClick={() => { setEditOutfit(null); setShowModal(true); }}
        addLabel="Create Outfit"
      />

      <div className="p-4 lg:p-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {(['all', 'favorites'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'all' ? 'All Outfits' : '❤️ Favorites'}
            </button>
          ))}
        </div>

        {displayedOutfits.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'favorites' ? 'No favorite outfits yet' : 'No outfits yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'favorites'
                ? 'Heart your favorite outfits to see them here'
                : 'Create your first outfit combination!'
              }
            </p>
            {activeTab === 'all' && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Create First Outfit
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedOutfits.map(outfit => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                items={getOutfitItems(outfit)}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <OutfitBuilderModal
          outfit={editOutfit}
          onClose={() => { setShowModal(false); setEditOutfit(null); }}
        />
      )}
    </div>
  );
}
