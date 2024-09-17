import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DocumentList from './components/DocumentList';
import DocumentEdit from './components/DocumentEdit';

function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // useNavigate is used here inside a Router context

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/documents');
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/documents"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <DocumentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/document/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <DocumentEdit />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

// Make sure App is inside Router context here
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
