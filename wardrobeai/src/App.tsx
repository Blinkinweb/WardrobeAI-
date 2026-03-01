import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WardrobeProvider } from './context/WardrobeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import AISuggestions from './pages/AISuggestions';
import Planner from './pages/Planner';
import Profile from './pages/Profile';

function App() {
  return (
    <WardrobeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="wardrobe" element={<Wardrobe />} />
            <Route path="outfits" element={<Outfits />} />
            <Route path="ai-suggestions" element={<AISuggestions />} />
            <Route path="planner" element={<Planner />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WardrobeProvider>
  );
}

export default App;
