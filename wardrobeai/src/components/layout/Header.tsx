import { Menu, Bell, Plus } from 'lucide-react';
import { useWardrobe } from '../../context/WardrobeContext';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
  onAddClick?: () => void;
  addLabel?: string;
}

export default function Header({ onMenuClick, title, subtitle, onAddClick, addLabel }: HeaderProps) {
  const { userProfile } = useWardrobe();

  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-purple-200"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{addLabel || 'Add'}</span>
          </button>
        )}
        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
          {userProfile.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
