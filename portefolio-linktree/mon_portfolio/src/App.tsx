import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';


function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, background: 'red', color: 'white', padding: '8px 16px', fontSize: '18px', fontWeight: 'bold' }}>
        ✅ DEPLOY OK
      </div>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
