import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  MapPin, 
  Clock, 
  User,
  Building2,
  Hash,
  Filter,
  Eye,
  Download,
  MoreHorizontal,
  Tag,
  Calendar,
  Archive
} from 'lucide-react';
import { mockFiles, mockLocationHistory, locations } from '../data/mockData';
import { FileRecord, LocationHistory } from '../types';

export const InventoryTrackerTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showFileDetails, setShowFileDetails] = useState(false);

  // Filter files based on search and location
  const filteredFiles = useMemo(() => {
    return mockFiles.filter(file => {
      const matchesSearch = searchQuery === '' || 
        file.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.rfidTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = selectedLocation === '' || 
        file.currentLocation?.id === selectedLocation;
      
      return matchesSearch && matchesLocation;
    });
  }, [searchQuery, selectedLocation]);

  // Get files by location
  const filesByLocation = useMemo(() => {
    const locationMap = new Map();
    mockFiles.forEach(file => {
      if (file.currentLocation) {
        const locationId = file.currentLocation.id;
        if (!locationMap.has(locationId)) {
          locationMap.set(locationId, {
            location: file.currentLocation,
            files: []
          });
        }
        locationMap.get(locationId).files.push(file);
      }
    });
    return Array.from(locationMap.values());
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      available: 'bg-green-100 text-green-800',
      'checked-out': 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const handleFileClick = (file: FileRecord) => {
    setSelectedFile(file);
    setShowFileDetails(true);
  };

  const getFileHistory = (fileId: string) => {
    return mockLocationHistory.filter(history => history.fileId === fileId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Archive className="w-6 h-6 mr-2" />
            Inventory Tracker
          </h2>
          <p className="text-indigo-100 mt-1">Track files by ID, tags, location and access history</p>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by File ID, RFID tag, file name, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{mockFiles.length}</div>
              <div className="text-sm text-blue-700">Total Files</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {mockFiles.filter(f => f.status === 'available').length}
              </div>
              <div className="text-sm text-green-700">Available</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {mockFiles.filter(f => f.status === 'checked-out').length}
              </div>
              <div className="text-sm text-yellow-700">Checked Out</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{locations.length}</div>
              <div className="text-sm text-purple-700">Locations</div>
            </div>
          </div>
        </div>
      </div>

      {/* File Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">File Inventory</h3>
          <p className="text-sm text-gray-500 mt-1">
            {filteredFiles.length} files {searchQuery || selectedLocation ? 'found' : 'in inventory'}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Accessed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{file.fileName}</div>
                        <div className="text-sm text-gray-500">
                          ID: {file.id} • RFID: {file.rfidTag} • {file.size}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {file.currentLocation ? (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.currentLocation.name}</div>
                          <div className="text-sm text-gray-500">
                            {file.currentLocation.building}, {file.currentLocation.room}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No location set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{formatDate(file.lastAccessed)}</div>
                        <div className="text-sm text-gray-500">by {file.accessedBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(file.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {file.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{file.tags.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleFileClick(file)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Files by Location */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Files by Location</h3>
          <p className="text-sm text-gray-500 mt-1">View all files grouped by their current location</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filesByLocation.map(({ location, files }) => (
              <div key={location.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <h4 className="font-medium text-gray-900">{location.name}</h4>
                      <p className="text-sm text-gray-500">{location.building}, {location.room}</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {files.length} files
                  </span>
                </div>
                <div className="space-y-2">
                  {files.slice(0, 3).map(file => (
                    <div key={file.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">{file.fileName}</span>
                      <span className="text-gray-500">{file.rfidTag}</span>
                    </div>
                  ))}
                  {files.length > 3 && (
                    <div className="text-sm text-gray-500 text-center pt-2">
                      +{files.length - 3} more files
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* File Details Modal */}
      {showFileDetails && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">File Details & History</h3>
                <button
                  onClick={() => setShowFileDetails(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* File Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">File Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{selectedFile.fileName}</div>
                        <div className="text-sm text-gray-500">{selectedFile.fileType} • {selectedFile.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Hash className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">ID: {selectedFile.id}</div>
                        <div className="text-sm text-gray-500">RFID: {selectedFile.rfidTag}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-3" />
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedFile.department.color}`}>
                        {selectedFile.department.name}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedFile.currentLocation?.name || 'No location set'}
                        </div>
                        {selectedFile.currentLocation && (
                          <div className="text-sm text-gray-500">
                            {selectedFile.currentLocation.building}, {selectedFile.currentLocation.room}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Last accessed by {selectedFile.accessedBy}</div>
                        <div className="text-sm text-gray-500">{formatDate(selectedFile.lastAccessed)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-3" />
                      {getStatusBadge(selectedFile.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location History */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Location History</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Moved By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFileHistory(selectedFile.id).map((history) => (
                        <tr key={history.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{history.location.name}</div>
                                <div className="text-sm text-gray-500">{history.location.building}, {history.location.room}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {history.movedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(history.movedDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {history.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};