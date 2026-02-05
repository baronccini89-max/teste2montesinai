import { useState } from 'react';
import { Home } from './pages/Home';
import { CertificateGenerator } from './pages/CertificateGenerator';
import { CertificateHistory } from './pages/CertificateHistory';
import { DataManagement } from './pages/DataManagement';

type Page = 'home' | 'certificate' | 'history' | 'data';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'certificate' && <CertificateGenerator onBack={() => setCurrentPage('home')} />}
      {currentPage === 'history' && <CertificateHistory onBack={() => setCurrentPage('home')} />}
      {currentPage === 'data' && <DataManagement onBack={() => setCurrentPage('home')} />}
    </div>
  );
}

export default App;
