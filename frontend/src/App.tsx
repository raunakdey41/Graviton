import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { Workspace } from './pages/Workspace';
import { SplashScreen } from './components/navigation/SplashScreen';

export default function App() {
  return (
    <>
      <SplashScreen />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<Workspace />} />
        </Routes>
      </Router>
    </>
  );
}
