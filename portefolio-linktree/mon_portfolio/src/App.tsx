import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';


function App() {
  return (
    // TEST DEPLOY - remove this style
    <div style={{ background: 'red', minHeight: '100vh' }}>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
    </div>
  );
}

export default App;
