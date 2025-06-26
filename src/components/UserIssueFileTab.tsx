import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  Building2, 
  Clock, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Search,
  Send,
  MessageSquare,
  Info
} from 'lucide-react';
import { Department, FileRequest } from '../types';

interface UserIssueFileTabProps {
  departments: Department[];
  onFileRequest: (request: Omit<FileRequest, 'id' | 'requestDate' | 'status'>) => void;
  currentUser: string;
}

export const UserIssueFileTab: React.FC<UserIssueFileTabProps> = ({ 
  departments, 
  onFileRequest,
  currentUser 
}) => {
  const [formData, setFormData] = useState({
    rfidTag: '',
    fileName: '',
    department: '',
    duration: '',
    customDuration: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const durationOptions = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '1 Week' },
    { value: '14', label: '2 Weeks' },
    { value: '30', label: '1 Month' },
    { value: 'custom', label: 'Custom Duration' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.rfidTag.trim()) {
      newErrors.rfidTag = 'RFID Tag is required';
    }

    if (!formData.fileName.trim()) {
      newErrors.fileName = 'File name is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    if (formData.duration === 'custom' && !formData.customDuration) {
      newErrors.customDuration = 'Custom duration is required';
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
      const selectedDepartment = departments.find(d => d.id === formData.department)!;
      const durationDays = formData.duration === 'custom' 
        ? parseInt(formData.customDuration) 
        : parseInt(formData.duration);
      
      const request: Omit<FileRequest, 'id' | 'requestDate' | 'status'> = {
        type: 'issue',
        rfidTag: formData.rfidTag,
        fileName: formData.fileName,
        requestedBy: currentUser,
        department: selectedDepartment,
        duration: `${durationDays} day${durationDays > 1 ? 's' : ''}`,
        notes: formData.notes
      };

      onFileRequest(request);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        rfidTag: '',
        fileName: '',
        department: '',
        duration: '',
        customDuration: '',
        notes: ''
      });

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Issue Request Submitted Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">Your file issue request has been sent to the admin for approval.</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Request to Issue File</h3>
            <p className="text-sm text-blue-700 mt-1">
              Submit a request to issue a file to someone. The admin will review and approve your request before the file is actually issued.
            </p>
          </div>
        </div>
      </div>

      {/* Request File Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Send className="w-6 h-6 mr-2" />
            Request File Issue
          </h2>
          <p className="text-blue-100 mt-1">Submit a request to issue a file to a user</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RFID Tag */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                RFID Tag Number *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.rfidTag}
                  onChange={(e) => setFormData({ ...formData, rfidTag: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.rfidTag ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter RFID tag number (e.g., RFID001)"
                />
              </div>
              {errors.rfidTag && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.rfidTag}
                </p>
              )}
            </div>

            {/* File Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                File Name *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.fileName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter file name"
                />
              </div>
              {errors.fileName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fileName}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.department}
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requested Duration *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Duration</option>
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.duration}
                </p>
              )}
            </div>

            {/* Custom Duration */}
            {formData.duration === 'custom' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Duration (Days) *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    min="1"
                    value={formData.customDuration}
                    onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.customDuration ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter number of days"
                  />
                </div>
                {errors.customDuration && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.customDuration}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Request Notes
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Please explain why you need to issue this file and any additional details..."
              />
            </div>
          </div>

          {/* User Info Display */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Request will be submitted by: {currentUser}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Request...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Submit Issue Request
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};