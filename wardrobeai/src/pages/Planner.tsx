import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, X, Calendar, Trash2 } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import Header from '../components/layout/Header';
import type { OutfitPlan, Occasion } from '../types';

interface OutletContext {
  onMenuClick: () => void;
}

const categoryEmoji: Record<string, string> = {
  tops: '👕', bottoms: '👖', dresses: '👗', outerwear: '🧥',
  shoes: '👟', accessories: '💍', activewear: '🏃', formal: '👔',
};

const occasionColors: Record<string, string> = {
  casual: 'bg-blue-100 text-blue-700 border-blue-200',
  work: 'bg-green-100 text-green-700 border-green-200',
  formal: 'bg-purple-100 text-purple-700 border-purple-200',
  sport: 'bg-orange-100 text-orange-700 border-orange-200',
  party: 'bg-pink-100 text-pink-700 border-pink-200',
  date: 'bg-red-100 text-red-700 border-red-200',
  outdoor: 'bg-teal-100 text-teal-700 border-teal-200',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface PlanModalProps {
  date: string;
  plan?: OutfitPlan | null;
  onClose: () => void;
}

function PlanModal({ date, plan, onClose }: PlanModalProps) {
  const { outfits, clothingItems, addOutfitPlan, updateOutfitPlan } = useWardrobe();
  const [selectedOutfitId, setSelectedOutfitId] = useState(plan?.outfitId || '');
  const [occasion, setOccasion] = useState<Occasion>(plan?.occasion || 'casual');
  const [notes, setNotes] = useState(plan?.notes || '');
  const [weather, setWeather] = useState(plan?.weather || '');

  const allOccasions: Occasion[] = ['casual', 'work', 'formal', 'sport', 'party', 'date', 'outdoor'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const planData = {
      date,
      outfitId: selectedOutfitId || undefined,
      occasion,
      notes: notes.trim() || undefined,
      weather: weather.trim() || undefined,
    };

    if (plan) {
      updateOutfitPlan(plan.id, planData);
    } else {
      addOutfitPlan(planData);
    }
    onClose();
  };

  const selectedOutfit = outfits.find(o => o.id === selectedOutfitId);
  const outfitItems = selectedOutfit
    ? selectedOutfit.items.map(id => clothingItems.find(i => i.id === id)).filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{plan ? 'Edit Plan' : 'Plan Outfit'}</h2>
            <p className="text-sm text-gray-500">{new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Outfit selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Outfit</label>
            <select
              value={selectedOutfitId}
              onChange={e => setSelectedOutfitId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
            >
              <option value="">-- Choose an outfit --</option>
              {outfits.map(outfit => (
                <option key={outfit.id} value={outfit.id}>{outfit.name}</option>
              ))}
            </select>
          </div>

          {/* Outfit preview */}
          {selectedOutfit && outfitItems.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">Outfit Preview</p>
              <div className="flex gap-2 flex-wrap">
                {outfitItems.slice(0, 5).map((item: any) => (
                  <div
                    key={item.id}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
                  >
                    {categoryEmoji[item.category]}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Occasion */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Occasion</label>
            <div className="flex flex-wrap gap-2">
              {allOccasions.map(occ => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all
                    ${occasion === occ ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Weather */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Weather (optional)</label>
            <input
              type="text"
              value={weather}
              onChange={e => setWeather(e.target.value)}
              placeholder="e.g., Sunny, 22°C"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Board meeting, Date night"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-md"
            >
              {plan ? 'Update Plan' : 'Add to Planner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Planner() {
  const { onMenuClick } = useOutletContext<OutletContext>();
  const { outfitPlans, outfits, clothingItems, deleteOutfitPlan } = useWardrobe();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState<OutfitPlan | null>(null);
  const [showModal, setShowModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getPlanForDate = (dateStr: string) => outfitPlans.find(p => p.date === dateStr);

  const getOutfitForPlan = (plan: OutfitPlan) => {
    if (!plan.outfitId) return null;
    return outfits.find(o => o.id === plan.outfitId);
  };

  const formatDate = (day: number) => {
    const d = new Date(year, month, day);
    return d.toISOString().split('T')[0];
  };

  const today = new Date().toISOString().split('T')[0];

  const handleDayClick = (dateStr: string) => {
    const plan = getPlanForDate(dateStr);
    if (plan) {
      setEditPlan(plan);
    } else {
      setEditPlan(null);
    }
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const upcomingPlans = outfitPlans
    .filter(p => p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuClick={onMenuClick}
        title="Outfit Planner"
        subtitle="Plan your looks ahead of time"
      />

      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-900">
                {MONTHS[month]} {year}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for first week */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = formatDate(day);
                const plan = getPlanForDate(dateStr);
                void (plan ? getOutfitForPlan(plan) : null);
                const isToday = dateStr === today;
                const isPast = dateStr < today;

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(dateStr)}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-start p-1 transition-all text-sm
                      ${isToday ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md' : ''}
                      ${!isToday && plan ? 'bg-purple-50 border border-purple-200' : ''}
                      ${!isToday && !plan ? 'hover:bg-gray-50' : ''}
                      ${isPast && !isToday ? 'opacity-50' : ''}
                    `}
                  >
                    <span className={`font-semibold text-xs ${isToday ? 'text-white' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    {plan && !isToday && (
                      <div className="mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full mx-auto ${occasionColors[plan.occasion || 'casual']?.split(' ')[0] || 'bg-purple-400'}`} />
                      </div>
                    )}
                    {plan && isToday && (
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-white/70 mx-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-200" />
                <span className="text-xs text-gray-500">Planned</span>
              </div>
            </div>
          </div>

          {/* Upcoming Plans */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Upcoming Plans
              </h3>

              {upcomingPlans.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="text-sm text-gray-500">No upcoming plans</p>
                  <p className="text-xs text-gray-400 mt-1">Click on a date to plan an outfit</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingPlans.map(plan => {
                    const outfit = getOutfitForPlan(plan);
                    const outfitItems = outfit
                      ? outfit.items.slice(0, 3).map(id => clothingItems.find(i => i.id === id)).filter(Boolean)
                      : [];
                    const planDate = new Date(plan.date + 'T12:00:00');
                    const isToday = plan.date === today;

                    return (
                      <div
                        key={plan.id}
                        className={`rounded-xl p-3 border ${isToday ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold ${isToday ? 'text-purple-600' : 'text-gray-700'}`}>
                                {isToday ? 'Today' : planDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </span>
                              {plan.occasion && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full border capitalize ${occasionColors[plan.occasion] || 'bg-gray-100 text-gray-600'}`}>
                                  {plan.occasion}
                                </span>
                              )}
                            </div>
                            {outfit && (
                              <p className="text-sm font-medium text-gray-900 truncate">{outfit.name}</p>
                            )}
                            {plan.notes && (
                              <p className="text-xs text-gray-500 truncate">{plan.notes}</p>
                            )}
                            {outfitItems.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {outfitItems.map((item: any) => (
                                  <div
                                    key={item.id}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                                    style={{ backgroundColor: item.imageColor || '#e5e7eb' }}
                                  >
                                    {categoryEmoji[item.category]}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => deleteOutfitPlan(plan.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick add */}
            <button
              onClick={() => {
                setSelectedDate(today);
                setEditPlan(getPlanForDate(today) || null);
                setShowModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md shadow-purple-200"
            >
              <Plus className="w-4 h-4" />
              Plan Today's Outfit
            </button>
          </div>
        </div>
      </div>

      {showModal && selectedDate && (
        <PlanModal
          date={selectedDate}
          plan={editPlan}
          onClose={() => { setShowModal(false); setSelectedDate(null); setEditPlan(null); }}
        />
      )}
    </div>
  );
}
