import React, { useState, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { FileTable } from './FileTable';
import { StatsCards } from './StatsCards';
import { IssueFileTab } from './IssueFileTab';
import { UploadFileTab } from './UploadFileTab';
import { RequestsTab } from './RequestsTab';
import { mockFiles, departments } from '../data/mockData';
import { SearchFilters, FileRecord, FileRequest } from '../types';
import { LogOut, User, FileText, Plus, Upload, Inbox } from 'lucide-react';

interface AdminDashboardProps {
  onLogout?: () => void;
  fileRequests: FileRequest[];
  onRequestStatusChange: (requestId: string, status: 'approved' | 'rejected') => void;
  currentUser: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  fileRequests, 
  onRequestStatusChange,
  currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'issue-file' | 'upload-file' | 'requests'>('dashboard');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    tags: []
  });

  const filteredFiles = useMemo(() => {
    return mockFiles.filter((file: FileRecord) => {
      // Text search
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        const matchesName = file.fileName.toLowerCase().includes(query);
        const matchesTags = file.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesUser = file.accessedBy.toLowerCase().includes(query);
        
        if (!matchesName && !matchesTags && !matchesUser) {
          return false;
        }
      }

      // Department filter
      if (searchFilters.department) {
        if (file.department.id !== searchFilters.department) {
          return false;
        }
      }

      // Tags filter
      if (searchFilters.tags.length > 0) {
        const hasMatchingTags = searchFilters.tags.some(filterTag =>
          file.tags.some(fileTag => fileTag.toLowerCase().includes(filterTag.toLowerCase()))
        );
        if (!hasMatchingTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchFilters]);

  const pendingRequestsCount = fileRequests.filter(req => req.status === 'pending').length;

  const tabs = [
    {
      id: 'dashboard' as const,
      name: 'Dashboard',
      icon: FileText,
      description: 'View and manage files'
    },
    {
      id: 'issue-file' as const,
      name: 'Issue File',
      icon: Plus,
      description: 'Issue files to users'
    },
    {
      id: 'upload-file' as const,
      name: 'Upload File',
      icon: Upload,
      description: 'Upload new files to cloud'
    },
    {
      id: 'requests' as const,
      name: 'Requests',
      icon: Inbox,
      description: 'Manage file requests',
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform rotate-45 text-6xl font-bold text-gray-400 select-none">
            SOOCHAK BHARAT
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header with Logo and Logout */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/ogo.png" 
                alt="Soochak Bharat Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                File Management Software
              </h1>
              <p className="text-gray-600 flex items-center">
                <span className="font-medium text-blue-600 mr-2">Soochak Bharat</span>
                • Advanced Document Management And Tracking Solution
              </p>
            </div>
          </div>
          
          {onLogout && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{currentUser} (Admin)</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Company Branding Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 mb-8 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Admin File Management Portal</h2>
                <p className="text-blue-100 text-sm">Powered by Soochak Bharat Technology</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Secure • Efficient • Reliable</div>
              <div className="text-xs text-blue-200">Administrator Access Level</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-2 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs text-gray-400">{tab.description}</div>
                    </div>
                    {tab.badge && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            <StatsCards files={mockFiles} />
            <SearchBar 
              onSearch={setSearchFilters} 
              departments={departments}
            />
            <FileTable files={filteredFiles} />
          </>
        )}

        {activeTab === 'issue-file' && (
          <IssueFileTab departments={departments} />
        )}

        {activeTab === 'upload-file' && (
          <UploadFileTab departments={departments} />
        )}

        {activeTab === 'requests' && (
          <RequestsTab 
            requests={fileRequests}
            onStatusChange={onRequestStatusChange}
          />
        )}

        {/* Footer with Company Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>© 2025  Soochak Bharat</span>
              <span>•</span>
              <span>File Management Software</span>
              <span>•</span>
              <span>Version 1.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by</span>
              <span className="font-semibold text-blue-600">Soochak Bharat Technology Pvt Ltd</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
