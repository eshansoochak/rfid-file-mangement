import React, { useState } from 'react';
import { FileRecord } from '../types';
import { 
  File, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Clock, 
  User, 
  Building2,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  MoreHorizontal
} from 'lucide-react';

interface FileTableProps {
  files: FileRecord[];
}

type SortField = 'fileName' | 'lastAccessed' | 'accessedBy' | 'department';
type SortDirection = 'asc' | 'desc';

export const FileTable: React.FC<FileTableProps> = ({ files }) => {
  const [sortField, setSortField] = useState<SortField>('lastAccessed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'word':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'powerpoint':
        return <Presentation className="w-5 h-5 text-orange-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedFiles = React.useMemo(() => {
    return [...files].sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortField) {
        case 'fileName':
          aVal = a.fileName.toLowerCase();
          bVal = b.fileName.toLowerCase();
          break;
        case 'lastAccessed':
          aVal = a.lastAccessed.getTime();
          bVal = b.lastAccessed.getTime();
          break;
        case 'accessedBy':
          aVal = a.accessedBy.toLowerCase();
          bVal = b.accessedBy.toLowerCase();
          break;
        case 'department':
          aVal = a.department.name.toLowerCase();
          bVal = b.department.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [files, sortField, sortDirection]);

  const SortHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
        <p className="text-sm text-gray-500 mt-1">{files.length} files found</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortHeader field="fileName">File Name</SortHeader>
              <SortHeader field="department">Department</SortHeader>
              <SortHeader field="lastAccessed">Last Accessed</SortHeader>
              <SortHeader field="accessedBy">Accessed By</SortHeader>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFiles.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getFileIcon(file.fileType)}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{file.fileName}</div>
                      <div className="text-sm text-gray-500">{file.fileType} • {file.size}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${file.department.color}`}>
                    <Building2 className="w-3 h-3 mr-1" />
                    {file.department.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    {formatDate(file.lastAccessed)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    {file.accessedBy}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {file.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {file.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{file.tags.length - 3} more</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(file.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 transition-colors">
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
  );
};