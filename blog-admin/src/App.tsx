import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../shared/components/auth';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
// import { PostEditor } from './pages/PostEditor';
import { Layout } from './components/Layout';
import { ProtectedRoute } from '../../shared/components/auth';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute adminOnly>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/posts" replace />} />
            <Route path="posts" element={<Dashboard />} />
            {/* <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/:id/edit" element={<PostEditor />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;