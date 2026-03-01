import { useOutletContext } from 'react-router-dom';
import { Shirt, LayoutGrid, TrendingUp, Calendar, Sparkles, Heart, Star, ArrowRight } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import Header from '../components/layout/Header';

interface OutletContext {
  onMenuClick: () => void;
}

export default function Dashboard() {
  const { onMenuClick } = useOutletContext<OutletContext>();
  const { clothingItems, outfits, outfitPlans, userProfile } = useWardrobe();

  const totalItems = clothingItems.length;
  const favoriteItems = clothingItems.filter(i => i.isFavorite).length;
  const totalOutfits = outfits.length;
  const plannedOutfits = outfitPlans.length;

  const recentItems = [...clothingItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const mostWorn = [...clothingItems]
    .sort((a, b) => b.timesWorn - a.timesWorn)
    .slice(0, 3);

  const categoryCount = clothingItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const categoryEmoji: Record<string, string> = {
    tops: '👕', bottoms: '👖', dresses: '👗', outerwear: '🧥',
    shoes: '👟', accessories: '💍', activewear: '🏃', formal: '👔',
  };

  const colorMap: Record<string, string> = {
    tops: 'from-blue-400 to-blue-600',
    bottoms: 'from-indigo-400 to-indigo-600',
    dresses: 'from-pink-400 to-pink-600',
    outerwear: 'from-gray-400 to-gray-600',
    shoes: 'from-orange-400 to-orange-600',
    accessories: 'from-yellow-400 to-yellow-600',
    activewear: 'from-green-400 to-green-600',
    formal: 'from-purple-400 to-purple-600',
  };

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={onMenuClick}
        title="Dashboard"
        subtitle={`${greeting}, ${userProfile.name.split(' ')[0]}! 👋`}
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shirt className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">+3 new</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-sm text-gray-500 mt-0.5">Total Items</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">{Math.round(favoriteItems / totalItems * 100)}%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{favoriteItems}</p>
            <p className="text-sm text-gray-500 mt-0.5">Favorites</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalOutfits}</p>
            <p className="text-sm text-gray-500 mt-0.5">Outfits</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{plannedOutfits}</p>
            <p className="text-sm text-gray-500 mt-0.5">Planned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Suggestion Banner */}
          <div className="lg:col-span-2 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold opacity-90">AI Stylist</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Today's Outfit Suggestion</h3>
              <p className="text-sm opacity-80 mb-4">
                Based on your style preferences and the weather today, we've curated the perfect outfit for you.
              </p>
              <div className="flex items-center gap-3 mb-4">
                {['👕', '👖', '👟'].map((emoji, i) => (
                  <div key={i} className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                    {emoji}
                  </div>
                ))}
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white/60 text-sm font-medium">
                  +2
                </div>
              </div>
              <button className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors">
                View Suggestions <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Wardrobe Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Wardrobe Breakdown</h3>
            <div className="space-y-3">
              {topCategories.map(([category, count]) => (
                <div key={category} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorMap[category] || 'from-gray-400 to-gray-600'} flex items-center justify-center text-sm`}>
                    {categoryEmoji[category] || '👕'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                      <span className="text-xs text-gray-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colorMap[category] || 'from-gray-400 to-gray-600'} rounded-full`}
                        style={{ width: `${(count / totalItems) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recently Added */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recently Added</h3>
              <button className="text-sm text-purple-600 font-medium hover:text-purple-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {recentItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
                  >
                    {categoryEmoji[item.category] || '👕'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.category} • {item.brand || 'No brand'}</p>
                  </div>
                  {item.isFavorite && <Heart className="w-4 h-4 text-pink-500 flex-shrink-0" fill="currentColor" />}
                </div>
              ))}
            </div>
          </div>

          {/* Most Worn */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Most Worn</h3>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mostWorn.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
                  >
                    {categoryEmoji[item.category] || '👕'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.timesWorn} times worn</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5" fill="currentColor" />
                    <span className="text-xs font-medium text-gray-600">{item.timesWorn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Style Tips */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Style Tip of the Day</h3>
              <p className="text-sm text-gray-600">
                You have {clothingItems.filter(i => i.timesWorn === 0).length} unworn items in your wardrobe! 
                Try incorporating them into new outfit combinations. Your {mostWorn[0]?.name} is your most-worn piece — 
                consider pairing it with something you haven't tried yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
