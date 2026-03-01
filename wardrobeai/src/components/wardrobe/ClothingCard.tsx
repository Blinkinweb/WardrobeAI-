import { Heart, Edit2, Trash2, Star } from 'lucide-react';
import type { ClothingItem } from '../../types';
import { useWardrobe } from '../../context/WardrobeContext';

interface ClothingCardProps {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  viewMode?: 'grid' | 'list';
}

const categoryEmoji: Record<string, string> = {
  tops: '👕',
  bottoms: '👖',
  dresses: '👗',
  outerwear: '🧥',
  shoes: '👟',
  accessories: '💍',
  activewear: '🏃',
  formal: '👔',
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

export default function ClothingCard({ item, onEdit, viewMode = 'grid' }: ClothingCardProps) {
  const { toggleFavoriteItem, deleteClothingItem } = useWardrobe();

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
        {/* Color swatch */}
        <div
          className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm"
          style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
        >
          {categoryEmoji[item.category] || '👕'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{item.category} • {item.brand || 'No brand'}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.occasions.slice(0, 2).map(occ => (
                <span key={occ} className={`text-xs px-2 py-0.5 rounded-full font-medium ${occasionColors[occ] || 'bg-gray-100 text-gray-600'}`}>
                  {occ}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-400">Worn {item.timesWorn}x</span>
            {item.lastWorn && (
              <span className="text-xs text-gray-400">Last: {new Date(item.lastWorn).toLocaleDateString()}</span>
            )}
            {item.size && <span className="text-xs text-gray-400">Size {item.size}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleFavoriteItem(item.id)}
            className={`p-2 rounded-lg transition-colors ${item.isFavorite ? 'text-pink-500 bg-pink-50' : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'}`}
          >
            <Heart className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteClothingItem(item.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
      {/* Image/Color area */}
      <div
        className="h-40 flex items-center justify-center text-5xl relative"
        style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
      >
        {categoryEmoji[item.category] || '👕'}

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavoriteItem(item.id); }}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all
            ${item.isFavorite
              ? 'bg-white text-pink-500 shadow-md'
              : 'bg-white/70 text-gray-400 opacity-0 group-hover:opacity-100'
            }`}
        >
          <Heart className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Times worn badge */}
        {item.timesWorn > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            {item.timesWorn}x
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">{item.brand || item.category}</p>

        {/* Occasions */}
        <div className="flex flex-wrap gap-1 mt-2">
          {item.occasions.slice(0, 2).map(occ => (
            <span key={occ} className={`text-xs px-2 py-0.5 rounded-full font-medium ${occasionColors[occ] || 'bg-gray-100 text-gray-600'}`}>
              {occ}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            {item.seasons.slice(0, 2).map(season => (
              <span key={season} className="text-xs text-gray-400 capitalize">{season}</span>
            ))}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => deleteClothingItem(item.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
