import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { UserType, FileRequest } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>('user');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [fileRequests, setFileRequests] = useState<FileRequest[]>([]);

  const handleLogin = (credentials: { username: string; password: string }, type: UserType) => {
    console.log('Login attempt:', credentials, 'Type:', type);
    setIsAuthenticated(true);
    setUserType(type);
    setCurrentUser(credentials.username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType('user');
    setCurrentUser('');
  };

  const handleFileRequest = (request: Omit<FileRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: FileRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date(),
      status: 'pending'
    };
    setFileRequests(prev => [newRequest, ...prev]);
  };

  const handleRequestStatusChange = (requestId: string, status: 'approved' | 'rejected') => {
    setFileRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (userType === 'admin') {
    return (
      <AdminDashboard 
        onLogout={handleLogout} 
        fileRequests={fileRequests}
        onRequestStatusChange={handleRequestStatusChange}
        currentUser={currentUser}
      />
    );
  }

  return (
    <Dashboard 
      onLogout={handleLogout} 
      onFileRequest={handleFileRequest}
      currentUser={currentUser}
    />
  );
}

export default App;
