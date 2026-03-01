import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import type { ClothingItem, ClothingCategory, Season, Occasion, Color } from '../../types';
import { useWardrobe } from '../../context/WardrobeContext';

interface ClothingItemModalProps {
  item?: ClothingItem | null;
  onClose: () => void;
}

const categories: ClothingCategory[] = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'activewear', 'formal'];
const seasons: Season[] = ['spring', 'summer', 'fall', 'winter', 'all'];
const occasions: Occasion[] = ['casual', 'work', 'formal', 'sport', 'party', 'date', 'outdoor'];
const colors: Color[] = ['black', 'white', 'gray', 'navy', 'blue', 'red', 'pink', 'purple', 'green', 'yellow', 'orange', 'brown', 'beige', 'multicolor'];

const colorHex: Record<Color, string> = {
  black: '#111827',
  white: '#f9fafb',
  gray: '#9ca3af',
  navy: '#1e3a5f',
  blue: '#3b82f6',
  red: '#ef4444',
  pink: '#ec4899',
  purple: '#a855f7',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  brown: '#92400e',
  beige: '#d4a76a',
  multicolor: 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)',
};

const defaultForm = {
  name: '',
  category: 'tops' as ClothingCategory,
  color: 'black' as Color,
  seasons: [] as Season[],
  occasions: [] as Occasion[],
  brand: '',
  size: '',
  tags: '',
  price: '',
  notes: '',
  isFavorite: false,
  timesWorn: 0,
};

export default function ClothingItemModal({ item, onClose }: ClothingItemModalProps) {
  const { addClothingItem, updateClothingItem } = useWardrobe();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        color: item.color,
        seasons: item.seasons,
        occasions: item.occasions,
        brand: item.brand || '',
        size: item.size || '',
        tags: item.tags.join(', '),
        price: item.price?.toString() || '',
        notes: item.notes || '',
        isFavorite: item.isFavorite,
        timesWorn: item.timesWorn,
      });
    }
  }, [item]);

  const toggleArrayValue = <T extends string>(arr: T[], value: T): T[] => {
    return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const itemData = {
      name: form.name.trim(),
      category: form.category,
      color: form.color,
      seasons: form.seasons.length > 0 ? form.seasons : ['all' as Season],
      occasions: form.occasions.length > 0 ? form.occasions : ['casual' as Occasion],
      brand: form.brand.trim() || undefined,
      size: form.size.trim() || undefined,
      imageColor: colorHex[form.color],
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      price: form.price ? parseFloat(form.price) : undefined,
      notes: form.notes.trim() || undefined,
      isFavorite: form.isFavorite,
      timesWorn: form.timesWorn,
    };

    if (item) {
      updateClothingItem(item.id, itemData);
    } else {
      addClothingItem(itemData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image upload placeholder */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-purple-300 transition-colors cursor-pointer">
            <div
              className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-3xl"
              style={{ background: colorHex[form.color] || '#e5e7eb' }}
            >
              {form.category === 'tops' ? '👕' : form.category === 'bottoms' ? '👖' : form.category === 'dresses' ? '👗' : form.category === 'shoes' ? '👟' : form.category === 'accessories' ? '💍' : form.category === 'outerwear' ? '🧥' : form.category === 'activewear' ? '🏃' : '👔'}
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload photo (coming soon)</span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Classic White Button-Down"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className={`py-2 px-2 rounded-xl text-xs font-medium capitalize transition-all
                    ${form.category === cat
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Color *</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === color ? 'border-purple-500 scale-110' : 'border-transparent hover:border-gray-300'}`}
                  style={{ background: color === 'multicolor' ? 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)' : colorHex[color] }}
                  title={color}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1 capitalize">Selected: {form.color}</p>
          </div>

          {/* Seasons */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Seasons</label>
            <div className="flex flex-wrap gap-2">
              {seasons.map(season => (
                <button
                  key={season}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, seasons: toggleArrayValue(f.seasons, season) }))}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium capitalize transition-all
                    ${form.seasons.includes(season)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {season === 'spring' ? '🌸' : season === 'summer' ? '☀️' : season === 'fall' ? '🍂' : season === 'winter' ? '❄️' : '🌍'} {season}
                </button>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Occasions</label>
            <div className="flex flex-wrap gap-2">
              {occasions.map(occ => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, occasions: toggleArrayValue(f.occasions, occ) }))}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium capitalize transition-all
                    ${form.occasions.includes(occ)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Brand & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                placeholder="e.g., Zara"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Size</label>
              <input
                type="text"
                value={form.size}
                onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                placeholder="e.g., M, 32x30"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>
          </div>

          {/* Price & Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="classic, versatile"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any special care instructions or notes..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent resize-none"
            />
          </div>

          {/* Favorite */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isFavorite: !f.isFavorite }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.isFavorite ? 'bg-pink-500' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isFavorite ? 'translate-x-6' : ''}`} />
            </button>
            <span className="text-sm text-gray-700">Mark as favorite</span>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              {item ? 'Save Changes' : 'Add to Wardrobe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
