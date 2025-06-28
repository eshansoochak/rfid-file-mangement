import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  User, 
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  Search,
  Building2,
  Hash,
  MessageSquare,
  Archive
} from 'lucide-react';
import { locations, mockFileIssues } from '../data/mockData';
import { FileIssue, Location } from '../types';

interface FileIssuedCloserTabProps {
  currentUser: string;
}

export const FileIssuedCloserTab: React.FC<FileIssuedCloserTabProps> = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    userName: currentUser,
    fileId: '',
    rfidTag: '',
    issueDate: '',
    returnDate: '',
    returnLocation: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [closedIssues, setClosedIssues] = useState<FileIssue[]>([]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fileId.trim()) {
      newErrors.fileId = 'File ID is required';
    }

    if (!formData.rfidTag.trim()) {
      newErrors.rfidTag = 'RFID Tag is required';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }

    if (!formData.returnDate) {
      newErrors.returnDate = 'Return date is required';
    }

    if (!formData.returnLocation) {
      newErrors.returnLocation = 'Return location is required';
    }

    if (formData.issueDate && formData.returnDate) {
      const issueDate = new Date(formData.issueDate);
      const returnDate = new Date(formData.returnDate);
      if (returnDate < issueDate) {
        newErrors.returnDate = 'Return date cannot be before issue date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const selectedLocation = locations.find(l => l.id === formData.returnLocation)!;
      
      const closedIssue: FileIssue = {
        id: Date.now().toString(),
        fileId: formData.fileId,
        fileName: `File_${formData.fileId}`, // In real app, this would be fetched
        rfidTag: formData.rfidTag,
        issuedTo: formData.userName,
        issuedBy: 'System',
        issueDate: new Date(formData.issueDate),
        expectedReturnDate: new Date(formData.returnDate),
        actualReturnDate: new Date(),
        issueLocation: selectedLocation,
        returnLocation: selectedLocation,
        status: 'returned',
        notes: formData.notes
      };

      setClosedIssues(prev => [closedIssue, ...prev]);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        userName: currentUser,
        fileId: '',
        rfidTag: '',
        issueDate: '',
        returnDate: '',
        returnLocation: '',
        notes: ''
      });

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

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      issued: 'bg-blue-100 text-blue-800',
      returned: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">File Issue Closed Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">The file has been returned and the issue has been closed.</p>
            </div>
          </div>
        </div>
      )}

      {/* File Issue Closer Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Archive className="w-6 h-6 mr-2" />
            Close File Issue
          </h2>
          <p className="text-green-100 mt-1">Return an issued file and close the issue record</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                  placeholder="Your name"
                  readOnly
                />
              </div>
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
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
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
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

            {/* Issue Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Issue *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.issueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.issueDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.issueDate}
                </p>
              )}
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Return *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.returnDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.returnDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.returnDate}
                </p>
              )}
            </div>

            {/* Return Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Return Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.returnLocation}
                  onChange={(e) => setFormData({ ...formData, returnLocation: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.returnLocation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select return location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.building}, {location.room}
                    </option>
                  ))}
                </select>
              </div>
              {errors.returnLocation && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.returnLocation}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Return Notes
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter any notes about the file return..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Closing Issue...
                </div>
              ) : (
                <div className="flex items-center">
                  <Archive className="w-5 h-5 mr-2" />
                  Close File Issue
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recently Closed Issues */}
      {closedIssues.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recently Closed Issues</h3>
            <p className="text-sm text-gray-500 mt-1">{closedIssues.length} issues closed</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {closedIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{issue.fileName}</div>
                        <div className="text-sm text-gray-500">RFID: {issue.rfidTag}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Issued: {formatDate(issue.issueDate)}</div>
                        {issue.actualReturnDate && (
                          <div>Returned: {formatDate(issue.actualReturnDate)}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{issue.returnLocation?.name}</div>
                          <div className="text-sm text-gray-500">{issue.returnLocation?.building}, {issue.returnLocation?.room}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(issue.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Current Active Issues */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Active Issues</h3>
          <p className="text-sm text-gray-500 mt-1">Files currently issued and pending return</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issued To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Return
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockFileIssues.filter(issue => issue.status === 'issued').map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{issue.fileName}</div>
                      <div className="text-sm text-gray-500">RFID: {issue.rfidTag}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{issue.issuedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(issue.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(issue.expectedReturnDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(issue.status)}
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