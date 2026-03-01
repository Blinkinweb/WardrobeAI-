import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Edit2, Save, X, TrendingUp, Shirt, Heart, Star, DollarSign, BarChart2 } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import Header from '../components/layout/Header';
import type { Color, Occasion } from '../types';

interface OutletContext {
  onMenuClick: () => void;
}

const colorHex: Record<Color, string> = {
  black: '#111827', white: '#f9fafb', gray: '#9ca3af', navy: '#1e3a5f',
  blue: '#3b82f6', red: '#ef4444', pink: '#ec4899', purple: '#a855f7',
  green: '#22c55e', yellow: '#eab308', orange: '#f97316', brown: '#92400e',
  beige: '#d4a76a', multicolor: 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)',
};

const allColors: Color[] = ['black', 'white', 'gray', 'navy', 'blue', 'red', 'pink', 'purple', 'green', 'yellow', 'orange', 'brown', 'beige', 'multicolor'];
const allOccasions: Occasion[] = ['casual', 'work', 'formal', 'sport', 'party', 'date', 'outdoor'];
const styleOptions = ['minimalist', 'classic', 'bohemian', 'streetwear', 'preppy', 'romantic', 'edgy', 'sporty', 'smart casual', 'vintage'];

export default function Profile() {
  const { onMenuClick } = useOutletContext<OutletContext>();
  const { userProfile, updateUserProfile, clothingItems, outfits } = useWardrobe();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...userProfile });

  const handleSave = () => {
    updateUserProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...userProfile });
    setIsEditing(false);
  };

  const toggleColor = (color: Color) => {
    setEditForm(prev => ({
      ...prev,
      preferredColors: prev.preferredColors.includes(color)
        ? prev.preferredColors.filter(c => c !== color)
        : [...prev.preferredColors, color],
    }));
  };

  const toggleOccasion = (occ: Occasion) => {
    setEditForm(prev => ({
      ...prev,
      preferredOccasions: prev.preferredOccasions.includes(occ)
        ? prev.preferredOccasions.filter(o => o !== occ)
        : [...prev.preferredOccasions, occ],
    }));
  };

  const toggleStyle = (style: string) => {
    setEditForm(prev => ({
      ...prev,
      style: prev.style.includes(style)
        ? prev.style.filter(s => s !== style)
        : [...prev.style, style],
    }));
  };

  // Stats
  const totalValue = clothingItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalWears = clothingItems.reduce((sum, item) => sum + item.timesWorn, 0);
  const avgCostPerWear = totalWears > 0 ? totalValue / totalWears : 0;
  const favoriteItems = clothingItems.filter(i => i.isFavorite).length;
  const unwornItems = clothingItems.filter(i => i.timesWorn === 0).length;

  const colorCount = clothingItems.reduce((acc, item) => {
    acc[item.color] = (acc[item.color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topColors = Object.entries(colorCount).sort(([, a], [, b]) => b - a).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={onMenuClick}
        title="Profile"
        subtitle="Your style preferences & stats"
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                {userProfile.name.charAt(0)}
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={editForm.location || ''}
                    onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g., New York, NY"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
                {userProfile.location && (
                  <p className="text-gray-500 text-sm mt-0.5">📍 {userProfile.location}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Style Preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
          <h3 className="font-bold text-gray-900">Style Preferences</h3>

          {/* Style Tags */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">My Style</label>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map(style => (
                <button
                  key={style}
                  onClick={() => isEditing && toggleStyle(style)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                    ${(isEditing ? editForm.style : userProfile.style).includes(style)
                      ? 'bg-purple-500 text-white'
                      : isEditing ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-100 text-gray-500'
                    }
                    ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Colors */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Preferred Colors</label>
            <div className="flex flex-wrap gap-2">
              {allColors.map(color => (
                <button
                  key={color}
                  onClick={() => isEditing && toggleColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all
                    ${(isEditing ? editForm.preferredColors : userProfile.preferredColors).includes(color)
                      ? 'border-purple-500 scale-110 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                    }
                    ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{ background: color === 'multicolor' ? 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)' : colorHex[color] }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Preferred Occasions */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Preferred Occasions</label>
            <div className="flex flex-wrap gap-2">
              {allOccasions.map(occ => (
                <button
                  key={occ}
                  onClick={() => isEditing && toggleOccasion(occ)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                    ${(isEditing ? editForm.preferredOccasions : userProfile.preferredOccasions).includes(occ)
                      ? 'bg-pink-500 text-white'
                      : isEditing ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-100 text-gray-500'
                    }
                    ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wardrobe Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-500" />
            Wardrobe Statistics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <Shirt className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-purple-600">{clothingItems.length}</p>
              <p className="text-xs text-gray-600">Total Items</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <Heart className="w-5 h-5 text-pink-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-pink-600">{favoriteItems}</p>
              <p className="text-xs text-gray-600">Favorites</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">{totalWears}</p>
              <p className="text-xs text-gray-600">Total Wears</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Star className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-600">{outfits.length}</p>
              <p className="text-xs text-gray-600">Outfits</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <DollarSign className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-amber-600">${totalValue.toFixed(0)}</p>
              <p className="text-xs text-gray-600">Total Value</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <DollarSign className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-orange-600">${avgCostPerWear.toFixed(2)}</p>
              <p className="text-xs text-gray-600">Cost/Wear</p>
            </div>
          </div>

          {/* Color distribution */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Color Distribution</h4>
            <div className="space-y-2">
              {topColors.map(([color, count]) => (
                <div key={color} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0"
                    style={{ background: color === 'multicolor' ? 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)' : colorHex[color as Color] || '#e5e7eb' }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-gray-700 capitalize">{color}</span>
                      <span className="text-xs text-gray-500">{count} items</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / clothingItems.length) * 100}%`,
                          background: color === 'multicolor' ? 'linear-gradient(135deg, #f97316, #ec4899, #a855f7)' : colorHex[color as Color] || '#e5e7eb',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {unwornItems > 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-800">
                💡 You have <strong>{unwornItems} unworn items</strong> in your wardrobe. 
                Try the AI Stylist to discover new outfit combinations!
              </p>
            </div>
          )}
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">App Settings</h3>
          <div className="space-y-3">
            {[
              { label: 'Push Notifications', desc: 'Daily outfit reminders', enabled: true },
              { label: 'Weather Integration', desc: 'Auto-suggest based on weather', enabled: true },
              { label: 'Style Analytics', desc: 'Track your wearing patterns', enabled: false },
              { label: 'Social Sharing', desc: 'Share outfits with friends', enabled: false },
            ].map(setting => (
              <div key={setting.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                  <p className="text-xs text-gray-500">{setting.desc}</p>
                </div>
                <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${setting.enabled ? 'bg-purple-500' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${setting.enabled ? 'translate-x-5' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
