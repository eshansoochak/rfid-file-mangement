import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Building2, 
  CheckCircle,
  AlertCircle,
  X,
  Cloud,
  Tag,
  User,
  Hash,
  Send,
  MessageSquare,
  Info
} from 'lucide-react';
import { Department, FileRequest } from '../types';

interface UserUploadFileTabProps {
  departments: Department[];
  onFileRequest: (request: Omit<FileRequest, 'id' | 'requestDate' | 'status'>) => void;
  currentUser: string;
}

export const UserUploadFileTab: React.FC<UserUploadFileTabProps> = ({ 
  departments, 
  onFileRequest,
  currentUser 
}) => {
  const [formData, setFormData] = useState({
    fileName: '',
    department: '',
    createdBy: '',
    rfidTag: '',
    tags: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a PDF file to upload';
    } else if (selectedFile.type !== 'application/pdf') {
      newErrors.file = 'Only PDF files are allowed';
    }

    if (!formData.fileName.trim()) {
      newErrors.fileName = 'File name is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Creator name is required';
    }

    if (!formData.rfidTag.trim()) {
      newErrors.rfidTag = 'RFID Tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        if (!formData.fileName) {
          setFormData(prev => ({ ...prev, fileName: file.name.replace('.pdf', '') }));
        }
      } else {
        setErrors({ file: 'Only PDF files are allowed' });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        if (!formData.fileName) {
          setFormData(prev => ({ ...prev, fileName: file.name.replace('.pdf', '') }));
        }
        setErrors(prev => ({ ...prev, file: '' }));
      } else {
        setErrors({ file: 'Only PDF files are allowed' });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate file upload request
    setTimeout(() => {
      const selectedDepartment = departments.find(d => d.id === formData.department)!;
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const request: Omit<FileRequest, 'id' | 'requestDate' | 'status'> = {
        type: 'upload',
        rfidTag: formData.rfidTag,
        fileName: formData.fileName,
        requestedBy: currentUser,
        department: selectedDepartment,
        createdBy: formData.createdBy,
        tags: tags,
        fileSize: formatFileSize(selectedFile!.size),
        notes: formData.notes
      };

      onFileRequest(request);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        fileName: '',
        department: '',
        createdBy: '',
        rfidTag: '',
        tags: '',
        notes: ''
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Upload Request Submitted Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">Your file upload request has been sent to the admin for approval.</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Request to Upload File</h3>
            <p className="text-sm text-blue-700 mt-1">
              Submit a request to upload a file to cloud storage. The admin will review and approve your request before the file is actually uploaded.
            </p>
          </div>
        </div>
      </div>

      {/* Upload File Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Send className="w-6 h-6 mr-2" />
            Request File Upload
          </h2>
          <p className="text-blue-100 mt-1">Submit a request to upload a file to cloud storage</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select PDF File *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-50' 
                    : errors.file 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-4">
                  <FileText className="w-12 h-12 text-green-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your PDF file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Only PDF files are supported. Maximum file size: 50MB
                  </p>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.file}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Created By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Created By *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.createdBy ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter creator name (e.g., Mr. John Smith)"
                />
              </div>
              {errors.createdBy && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.createdBy}
                </p>
              )}
            </div>

            {/* RFID Tag */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                RFID Tag Number *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.rfidTag}
                  onChange={(e) => setFormData({ ...formData, rfidTag: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.rfidTag ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter RFID tag number (e.g., RFID009)"
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

          {/* Tags */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter tags separated by commas (e.g., contract, legal, important)"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
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
                placeholder="Please explain why you need to upload this file and any additional details..."
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
                  Submit Upload Request
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};