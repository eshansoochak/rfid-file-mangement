export interface FileRecord {
  id: string;
  fileName: string;
  department: Department;
  lastAccessed: Date;
  accessedBy: string;
  tags: string[];
  fileType: string;
  size: string;
  rfidTag: string;
  status: 'available' | 'checked-out' | 'archived';
}

export interface Department {
  id: string;
  name: string;
  color: string;
}

export interface SearchFilters {
  query: string;
  department?: string;
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export type UserType = 'user' | 'admin';

export type RequestType = 'issue' | 'upload';

export interface FileRequest {
  id: string;
  type: RequestType;
  rfidTag: string;
  fileName: string;
  requestedBy: string;
  department: Department;
  requestDate: Date;
  duration?: string; // Only for issue requests
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  // Upload specific fields
  createdBy?: string; // For upload requests
  tags?: string[]; // For upload requests
  fileSize?: string; // For upload requests (when file is selected)
}
