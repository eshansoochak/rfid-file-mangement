import React, { useState } from 'react';
import { 
  Inbox, 
  User, 
  Building2, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Filter,
  Search,
  Upload,
  Plus,
  FileText,
  Tag,
  Hash
} from 'lucide-react';
import { FileRequest } from '../types';

interface RequestsTabProps {
  requests: FileRequest[];
  onStatusChange: (requestId: string, status: 'approved' | 'rejected') => void;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({ requests, onStatusChange }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterType, setFilterType] = useState<'all' | 'issue' | 'upload'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.type === filterType;
    const matchesSearch = searchQuery === '' || 
      request.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.rfidTag.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

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
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    const statusIcons = {
      pending: AlertCircle,
      approved: CheckCircle,
      rejected: XCircle
    };

    const Icon = statusIcons[status as keyof typeof statusIcons];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.toUpperCase()}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      issue: 'bg-blue-100 text-blue-800 border-blue-200',
      upload: 'bg-purple-100 text-purple-800 border-purple-200'
    };

    const typeIcons = {
      issue: Plus,
      upload: Upload
    };

    const Icon = typeIcons[type as keyof typeof typeIcons];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${typeStyles[type as keyof typeof typeStyles]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {type.toUpperCase()}
      </span>
    );
  };

  const getStatusCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };
  };

  const getTypeCounts = () => {
    return {
      all: requests.length,
      issue: requests.filter(r => r.type === 'issue').length,
      upload: requests.filter(r => r.type === 'upload').length
    };
  };

  const statusCounts = getStatusCounts();
  const typeCounts = getTypeCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Inbox className="w-6 h-6 mr-2" />
            File Requests Management
          </h2>
          <p className="text-blue-100 mt-1">Review and manage file issue and upload requests from users</p>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by file name, user, or RFID tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="lg:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Types ({typeCounts.all})</option>
                <option value="issue">Issue Requests ({typeCounts.issue})</option>
                <option value="upload">Upload Requests ({typeCounts.upload})</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status ({statusCounts.all})</option>
                  <option value="pending">Pending ({statusCounts.pending})</option>
                  <option value="approved">Approved ({statusCounts.approved})</option>
                  <option value="rejected">Rejected ({statusCounts.rejected})</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
              <div className="text-sm text-blue-700">Total Requests</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
              <div className="text-sm text-green-700">Approved</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">
            {searchQuery || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria.' 
              : 'No file requests have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.fileName}</h3>
                      {getTypeBadge(request.type)}
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Requested by: {request.requestedBy}</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`px-2 py-1 rounded-full text-xs ${request.department.color}`}>
                          {request.department.name}
                        </span>
                      </div>
                      {request.duration && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Duration: {request.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{formatDate(request.requestDate)}</span>
                      </div>
                    </div>
                    
                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 mr-2 text-gray-400" />
                        <span>RFID: {request.rfidTag}</span>
                      </div>
                      {request.createdBy && (
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Created by: {request.createdBy}</span>
                        </div>
                      )}
                      {request.fileSize && (
                        <div className="flex items-center">
                          <Upload className="w-4 h-4 mr-2 text-gray-400" />
                          <span>File size: {request.fileSize}</span>
                        </div>
                      )}
                      {request.tags && request.tags.length > 0 && (
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-2 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {request.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {request.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{request.tags.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {request.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Request Notes:</div>
                        <div className="text-sm text-gray-600">{request.notes}</div>
                      </div>
                    </div>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => onStatusChange(request.id, 'approved')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve {request.type === 'issue' ? 'Issue' : 'Upload'}</span>
                    </button>
                    <button
                      onClick={() => onStatusChange(request.id, 'rejected')}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};