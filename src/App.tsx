import { Providers } from './providers';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <Providers>
      <MainLayout>
        <HomePage />
      </MainLayout>
    </Providers>
  );
}

export default App;