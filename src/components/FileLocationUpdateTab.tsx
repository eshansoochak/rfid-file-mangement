import React, { useState } from 'react';
import { 
  MapPin, 
  FileText, 
  Building2, 
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  ArrowRight,
  Hash,
  MessageSquare,
  Navigation
} from 'lucide-react';
import { locations, mockFiles, mockLocationHistory } from '../data/mockData';
import { Location, LocationHistory } from '../types';

interface FileLocationUpdateTabProps {
  currentUser: string;
}

export const FileLocationUpdateTab: React.FC<FileLocationUpdateTabProps> = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    fileId: '',
    rfidTag: '',
    newLocation: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationUpdates, setLocationUpdates] = useState<LocationHistory[]>([]);
  const [currentFileLocation, setCurrentFileLocation] = useState<Location | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fileId.trim()) {
      newErrors.fileId = 'File ID is required';
    }

    if (!formData.rfidTag.trim()) {
      newErrors.rfidTag = 'RFID Tag is required';
    }

    if (!formData.newLocation) {
      newErrors.newLocation = 'New location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSearch = () => {
    // Simulate finding file and its current location
    const file = mockFiles.find(f => f.id === formData.fileId || f.rfidTag === formData.rfidTag);
    if (file && file.currentLocation) {
      setCurrentFileLocation(file.currentLocation);
      if (!formData.rfidTag && file.rfidTag) {
        setFormData(prev => ({ ...prev, rfidTag: file.rfidTag }));
      }
      if (!formData.fileId && file.id) {
        setFormData(prev => ({ ...prev, fileId: file.id }));
      }
    } else {
      setCurrentFileLocation(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newLocation = locations.find(l => l.id === formData.newLocation)!;
      
      const locationUpdate: LocationHistory = {
        id: Date.now().toString(),
        fileId: formData.fileId,
        location: newLocation,
        movedBy: currentUser,
        movedDate: new Date(),
        previousLocation: currentFileLocation || undefined,
        notes: formData.notes
      };

      setLocationUpdates(prev => [locationUpdate, ...prev]);
      setCurrentFileLocation(newLocation);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        fileId: '',
        rfidTag: '',
        newLocation: '',
        notes: ''
      });
      setCurrentFileLocation(null);

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Location Updated Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">The file location has been updated and recorded in the system.</p>
            </div>
          </div>
        </div>
      )}

      {/* File Location Update Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Navigation className="w-6 h-6 mr-2" />
            Update File Location
          </h2>
          <p className="text-purple-100 mt-1">Track and update the current location of files</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                File ID *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.fileId}
                  onChange={(e) => setFormData({ ...formData, fileId: e.target.value })}
                  onBlur={handleFileSearch}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.fileId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter file ID (e.g., FILE001)"
                />
              </div>
              {errors.fileId && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fileId}
                </p>
              )}
            </div>

            {/* RFID Tag */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                RFID Tag *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.rfidTag}
                  onChange={(e) => setFormData({ ...formData, rfidTag: e.target.value })}
                  onBlur={handleFileSearch}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.rfidTag ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter RFID tag (e.g., RFID001)"
                />
              </div>
              {errors.rfidTag && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rfidTag}
                </p>
              )}
            </div>
          </div>

          {/* Current Location Display */}
          {currentFileLocation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Current Location</h4>
              <div className="flex items-center text-blue-700">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="font-medium">{currentFileLocation.name}</span>
                <span className="mx-2">•</span>
                <span>{currentFileLocation.building}, {currentFileLocation.room}</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">{currentFileLocation.description}</p>
            </div>
          )}

          {/* New Location */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Location *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={formData.newLocation}
                onChange={(e) => setFormData({ ...formData, newLocation: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.newLocation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select new location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name} - {location.building}, {location.room}
                  </option>
                ))}
              </select>
            </div>
            {errors.newLocation && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.newLocation}
              </p>
            )}
          </div>

          {/* Movement Preview */}
          {currentFileLocation && formData.newLocation && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-3">Location Change Preview</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-green-600 mr-2" />
                  <div>
                    <div className="font-medium text-green-800">{currentFileLocation.name}</div>
                    <div className="text-sm text-green-600">{currentFileLocation.building}, {currentFileLocation.room}</div>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-green-600 mx-4" />
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-green-600 mr-2" />
                  <div>
                    <div className="font-medium text-green-800">
                      {locations.find(l => l.id === formData.newLocation)?.name}
                    </div>
                    <div className="text-sm text-green-600">
                      {locations.find(l => l.id === formData.newLocation)?.building}, {locations.find(l => l.id === formData.newLocation)?.room}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Movement Notes
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter reason for location change or any additional notes..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating Location...
                </div>
              ) : (
                <div className="flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Update Location
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Location Updates */}
      {locationUpdates.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Location Updates</h3>
            <p className="text-sm text-gray-500 mt-1">{locationUpdates.length} location changes recorded</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moved By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locationUpdates.map((update) => (
                  <tr key={update.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{update.fileId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {update.previousLocation && (
                          <>
                            <div className="text-sm text-gray-500">{update.previousLocation.name}</div>
                            <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                          </>
                        )}
                        <div className="text-sm font-medium text-gray-900">{update.location.name}</div>
                      </div>
                      <div className="text-sm text-gray-500">{update.location.building}, {update.location.room}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {update.movedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(update.movedDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Location History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Location Movement History</h3>
          <p className="text-sm text-gray-500 mt-1">Historical record of all file location changes</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location Change
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
              {mockLocationHistory.map((history) => (
                <tr key={history.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{history.fileId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {history.previousLocation && (
                        <>
                          <div className="text-sm text-gray-500">{history.previousLocation.name}</div>
                          <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                        </>
                      )}
                      <div className="text-sm font-medium text-gray-900">{history.location.name}</div>
                    </div>
                    <div className="text-sm text-gray-500">{history.location.building}, {history.location.room}</div>
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
  );
};