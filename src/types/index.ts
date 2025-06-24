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