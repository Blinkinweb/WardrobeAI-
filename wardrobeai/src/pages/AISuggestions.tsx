import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, RefreshCw, Heart, Plus, ThumbsUp, ThumbsDown, Sun, Cloud, CloudRain, Wind } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import Header from '../components/layout/Header';
import type { ClothingItem, Occasion } from '../types';

interface OutletContext {
  onMenuClick: () => void;
}

const categoryEmoji: Record<string, string> = {
  tops: '👕', bottoms: '👖', dresses: '👗', outerwear: '🧥',
  shoes: '👟', accessories: '💍', activewear: '🏃', formal: '👔',
};

const occasions: Occasion[] = ['casual', 'work', 'formal', 'sport', 'party', 'date', 'outdoor'];

const weatherOptions = [
  { id: 'sunny', label: 'Sunny', icon: Sun, temp: '25°C', color: 'text-yellow-500' },
  { id: 'cloudy', label: 'Cloudy', icon: Cloud, temp: '18°C', color: 'text-gray-500' },
  { id: 'rainy', label: 'Rainy', icon: CloudRain, temp: '14°C', color: 'text-blue-500' },
  { id: 'windy', label: 'Windy', icon: Wind, temp: '16°C', color: 'text-teal-500' },
];

const aiReasons = [
  "Perfect for the current weather conditions",
  "Matches your style preferences",
  "These colors complement each other beautifully",
  "Great for the occasion you selected",
  "Based on your most-worn items",
  "A fresh combination you haven't tried yet",
  "Trending style that suits your wardrobe",
  "Classic combination that never goes out of style",
];

function generateAIOutfits(items: ClothingItem[], occasion: Occasion, weather: string) {
  const tops = items.filter(i => i.category === 'tops' && i.occasions.includes(occasion));
  const bottoms = items.filter(i => i.category === 'bottoms' && i.occasions.includes(occasion));
  const dresses = items.filter(i => i.category === 'dresses' && i.occasions.includes(occasion));
  const outerwear = items.filter(i => i.category === 'outerwear');
  const shoes = items.filter(i => i.category === 'shoes' && i.occasions.includes(occasion));
  const accessories = items.filter(i => i.category === 'accessories');

  const suggestions = [];

  // Generate 3-4 outfit suggestions
  for (let i = 0; i < 4; i++) {
    const outfitItems: ClothingItem[] = [];

    if (i % 3 === 0 && dresses.length > 0) {
      // Dress outfit
      const dress = dresses[i % dresses.length];
      outfitItems.push(dress);
      if (shoes.length > 0) outfitItems.push(shoes[i % shoes.length]);
      if (accessories.length > 0) outfitItems.push(accessories[i % accessories.length]);
      if (weather === 'cloudy' || weather === 'rainy' || weather === 'windy') {
        if (outerwear.length > 0) outfitItems.push(outerwear[i % outerwear.length]);
      }
    } else {
      // Top + bottom outfit
      if (tops.length > 0) outfitItems.push(tops[i % tops.length]);
      if (bottoms.length > 0) outfitItems.push(bottoms[i % bottoms.length]);
      if (shoes.length > 0) outfitItems.push(shoes[i % shoes.length]);
      if (accessories.length > 0 && i % 2 === 0) outfitItems.push(accessories[i % accessories.length]);
      if ((weather === 'cloudy' || weather === 'rainy' || weather === 'windy') && outerwear.length > 0) {
        outfitItems.push(outerwear[i % outerwear.length]);
      }
    }

    if (outfitItems.length >= 2) {
      suggestions.push({
        id: `ai-${i}`,
        items: outfitItems,
        reason: aiReasons[i % aiReasons.length],
        styleScore: Math.floor(Math.random() * 20) + 80,
        occasion,
      });
    }
  }

  return suggestions;
}

export default function AISuggestions() {
  const { onMenuClick } = useOutletContext<OutletContext>();
  const { clothingItems, addOutfit } = useWardrobe();
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('casual');
  const [selectedWeather, setSelectedWeather] = useState('sunny');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [likedSuggestions, setLikedSuggestions] = useState<Set<string>>(new Set());
  const [dislikedSuggestions, setDislikedSuggestions] = useState<Set<string>>(new Set());
  const [savedSuggestions, setSavedSuggestions] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    return generateAIOutfits(clothingItems, selectedOccasion, selectedWeather);
  }, [clothingItems, selectedOccasion, selectedWeather, generationCount]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setLikedSuggestions(new Set());
    setDislikedSuggestions(new Set());
    setTimeout(() => {
      setGenerationCount(c => c + 1);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveOutfit = (suggestion: ReturnType<typeof generateAIOutfits>[0]) => {
    addOutfit({
      name: `AI ${suggestion.occasion.charAt(0).toUpperCase() + suggestion.occasion.slice(1)} Outfit`,
      items: suggestion.items.map(i => i.id),
      occasions: [suggestion.occasion],
      seasons: ['all'],
      timesWorn: 0,
      isFavorite: false,
      aiGenerated: true,
    });
    setSavedSuggestions(prev => new Set([...prev, suggestion.id]));
  };

  const currentWeather = weatherOptions.find(w => w.id === selectedWeather)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={onMenuClick}
        title="AI Stylist"
        subtitle="Personalized outfit suggestions"
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* AI Banner */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold opacity-90">Powered by AI</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Your Personal Stylist</h2>
            <p className="text-sm opacity-80">
              Tell me the occasion and weather, and I'll create perfect outfit combinations from your wardrobe.
            </p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
          <h3 className="font-bold text-gray-900">What are you dressing for?</h3>

          {/* Occasion */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Occasion</label>
            <div className="flex flex-wrap gap-2">
              {occasions.map(occ => (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all
                    ${selectedOccasion === occ
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {occ === 'casual' ? '😊' : occ === 'work' ? '💼' : occ === 'formal' ? '🎩' : occ === 'sport' ? '🏃' : occ === 'party' ? '🎉' : occ === 'date' ? '❤️' : '🌿'} {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Weather */}
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Today's Weather</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {weatherOptions.map(weather => {
                const Icon = weather.icon;
                return (
                  <button
                    key={weather.id}
                    onClick={() => setSelectedWeather(weather.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                      ${selectedWeather === weather.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <Icon className={`w-6 h-6 ${weather.color}`} />
                    <span className="text-sm font-medium text-gray-700">{weather.label}</span>
                    <span className="text-xs text-gray-500">{weather.temp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-70 shadow-md shadow-purple-200"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating outfits...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Outfit Suggestions
              </>
            )}
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && !isGenerating && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">
                Suggested Outfits for {selectedOccasion.charAt(0).toUpperCase() + selectedOccasion.slice(1)}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <currentWeather.icon className={`w-4 h-4 ${currentWeather.color}`} />
                {currentWeather.label}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all
                    ${dislikedSuggestions.has(suggestion.id) ? 'opacity-40' : 'border-gray-100 hover:shadow-lg'}`}
                >
                  {/* Items display */}
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="flex items-center gap-3 flex-wrap">
                      {suggestion.items.map(item => (
                        <div key={item.id} className="text-center">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm mb-1"
                            style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
                          >
                            {categoryEmoji[item.category] || '👕'}
                          </div>
                          <p className="text-xs text-gray-500 truncate w-14">{item.name.split(' ')[0]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          ✨ AI Pick #{index + 1}
                        </span>
                        <span className="text-xs text-gray-500">{suggestion.styleScore}% match</span>
                      </div>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${suggestion.styleScore}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setLikedSuggestions(prev => new Set([...prev, suggestion.id]))}
                        className={`p-2 rounded-lg transition-colors ${likedSuggestions.has(suggestion.id) ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'}`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDislikedSuggestions(prev => new Set([...prev, suggestion.id]))}
                        className={`p-2 rounded-lg transition-colors ${dislikedSuggestions.has(suggestion.id) ? 'bg-red-100 text-red-500' : 'hover:bg-gray-100 text-gray-400'}`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <div className="flex-1" />
                      {savedSuggestions.has(suggestion.id) ? (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" fill="currentColor" /> Saved!
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSaveOutfit(suggestion)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Save Outfit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {suggestions.length === 0 && !isGenerating && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to style you!</h3>
            <p className="text-gray-500">
              Select your occasion and weather above, then click "Generate Outfit Suggestions"
            </p>
          </div>
        )}

        {/* Loading state */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing your wardrobe...</h3>
            <p className="text-gray-500">Creating personalized outfit combinations just for you</p>
          </div>
        )}

        {/* Style Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Style Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <p className="text-2xl font-bold text-purple-600">{clothingItems.length}</p>
              <p className="text-sm text-gray-600">Items in wardrobe</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <p className="text-2xl font-bold text-pink-600">
                {Math.pow(clothingItems.filter(i => i.category === 'tops').length, 2) + clothingItems.filter(i => i.category === 'dresses').length}+
              </p>
              <p className="text-sm text-gray-600">Possible combinations</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <p className="text-2xl font-bold text-indigo-600">
                {clothingItems.filter(i => i.timesWorn === 0).length}
              </p>
              <p className="text-sm text-gray-600">Unworn items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
