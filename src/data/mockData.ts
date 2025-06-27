import { FileRecord, Department, Location, LocationHistory, FileIssue } from '../types';

export const departments: Department[] = [
  { id: '1', name: 'Human Resources', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Finance', color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'Legal', color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Operations', color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Marketing', color: 'bg-pink-100 text-pink-800' },
  { id: '6', name: 'IT', color: 'bg-indigo-100 text-indigo-800' },
];

export const locations: Location[] = [
  { id: '1', name: 'Main Archive', description: 'Primary document storage facility', building: 'Building A', floor: 'Ground Floor', room: 'Room 101' },
  { id: '2', name: 'HR Department', description: 'Human Resources office storage', building: 'Building A', floor: '1st Floor', room: 'Room 201' },
  { id: '3', name: 'Finance Vault', description: 'Secure financial documents storage', building: 'Building B', floor: 'Basement', room: 'Vault 001' },
  { id: '4', name: 'Legal Library', description: 'Legal documents and contracts', building: 'Building A', floor: '2nd Floor', room: 'Room 301' },
  { id: '5', name: 'Operations Center', description: 'Operational procedures and manuals', building: 'Building C', floor: 'Ground Floor', room: 'Room 105' },
  { id: '6', name: 'Marketing Storage', description: 'Marketing materials and campaigns', building: 'Building A', floor: '1st Floor', room: 'Room 205' },
  { id: '7', name: 'IT Server Room', description: 'Technical documentation storage', building: 'Building B', floor: '1st Floor', room: 'Server Room' },
  { id: '8', name: 'Executive Office', description: 'Executive level documents', building: 'Building A', floor: '3rd Floor', room: 'Executive Suite' },
  { id: '9', name: 'Conference Room A', description: 'Meeting room document storage', building: 'Building A', floor: '2nd Floor', room: 'Conference A' },
  { id: '10', name: 'Mobile Storage Unit', description: 'Temporary mobile storage', building: 'External', floor: 'N/A', room: 'Mobile Unit 1' }
];

export const mockFiles: FileRecord[] = [
  {
    id: '1',
    fileName: 'Employee_Handbook_2024.pdf',
    department: departments[0],
    lastAccessed: new Date('2024-01-15T10:30:00'),
    accessedBy: 'Mr. John Smith',
    tags: ['handbook', 'employees', 'policies', 'hr'],
    fileType: 'PDF',
    size: '2.3 MB',
    rfidTag: 'RFID001',
    status: 'available',
    currentLocation: locations[1]
  },
  {
    id: '2',
    fileName: 'Q4_Financial_Report.xlsx',
    department: departments[1],
    lastAccessed: new Date('2024-01-14T14:45:00'),
    accessedBy: 'Ms. Sarah Johnson',
    tags: ['financial', 'quarterly', 'report', 'revenue'],
    fileType: 'Excel',
    size: '5.7 MB',
    rfidTag: 'RFID002',
    status: 'checked-out',
    currentLocation: locations[2]
  },
  {
    id: '3',
    fileName: 'Contract_Template_V3.docx',
    department: departments[2],
    lastAccessed: new Date('2024-01-14T09:15:00'),
    accessedBy: 'Mr. David Wilson',
    tags: ['contract', 'template', 'legal', 'agreement'],
    fileType: 'Word',
    size: '1.2 MB',
    rfidTag: 'RFID003',
    status: 'available',
    currentLocation: locations[3]
  },
  {
    id: '4',
    fileName: 'Operational_Procedures.pdf',
    department: departments[3],
    lastAccessed: new Date('2024-01-13T16:20:00'),
    accessedBy: 'Ms. Emily Davis',
    tags: ['procedures', 'operations', 'workflow', 'sop'],
    fileType: 'PDF',
    size: '4.1 MB',
    rfidTag: 'RFID004',
    status: 'available',
    currentLocation: locations[4]
  },
  {
    id: '5',
    fileName: 'Brand_Guidelines_2024.pdf',
    department: departments[4],
    lastAccessed: new Date('2024-01-13T11:30:00'),
    accessedBy: 'Mr. Michael Brown',
    tags: ['brand', 'guidelines', 'marketing', 'design'],
    fileType: 'PDF',
    size: '8.9 MB',
    rfidTag: 'RFID005',
    status: 'available',
    currentLocation: locations[5]
  },
  {
    id: '6',
    fileName: 'Network_Security_Policy.docx',
    department: departments[5],
    lastAccessed: new Date('2024-01-12T13:45:00'),
    accessedBy: 'Mr. Robert Garcia',
    tags: ['security', 'network', 'policy', 'it', 'cybersecurity'],
    fileType: 'Word',
    size: '3.2 MB',
    rfidTag: 'RFID006',
    status: 'archived',
    currentLocation: locations[6]
  },
  {
    id: '7',
    fileName: 'Training_Materials_2024.pptx',
    department: departments[0],
    lastAccessed: new Date('2024-01-12T08:00:00'),
    accessedBy: 'Ms. Lisa Anderson',
    tags: ['training', 'presentation', 'onboarding', 'hr'],
    fileType: 'PowerPoint',
    size: '12.4 MB',
    rfidTag: 'RFID007',
    status: 'available',
    currentLocation: locations[0]
  },
  {
    id: '8',
    fileName: 'Budget_Forecast_2024.xlsx',
    department: departments[1],
    lastAccessed: new Date('2024-01-11T15:30:00'),
    accessedBy: 'Mr. Christopher Lee',
    tags: ['budget', 'forecast', 'financial', 'planning'],
    fileType: 'Excel',
    size: '4.8 MB',
    rfidTag: 'RFID008',
    status: 'checked-out',
    currentLocation: locations[7]
  }
];

export const mockLocationHistory: LocationHistory[] = [
  {
    id: '1',
    fileId: '1',
    location: locations[1],
    movedBy: 'Mr. John Smith',
    movedDate: new Date('2024-01-15T10:30:00'),
    previousLocation: locations[0],
    notes: 'Moved for HR review'
  },
  {
    id: '2',
    fileId: '2',
    location: locations[2],
    movedBy: 'Ms. Sarah Johnson',
    movedDate: new Date('2024-01-14T14:45:00'),
    previousLocation: locations[0],
    notes: 'Secured in finance vault for audit'
  },
  {
    id: '3',
    fileId: '3',
    location: locations[3],
    movedBy: 'Mr. David Wilson',
    movedDate: new Date('2024-01-14T09:15:00'),
    previousLocation: locations[0],
    notes: 'Legal review in progress'
  }
];

export const mockFileIssues: FileIssue[] = [
  {
    id: '1',
    fileId: '2',
    fileName: 'Q4_Financial_Report.xlsx',
    rfidTag: 'RFID002',
    issuedTo: 'Ms. Sarah Johnson',
    issuedBy: 'Admin User',
    issueDate: new Date('2024-01-14T09:00:00'),
    expectedReturnDate: new Date('2024-01-21T17:00:00'),
    issueLocation: locations[2],
    status: 'issued',
    notes: 'For quarterly review and analysis'
  },
  {
    id: '2',
    fileId: '8',
    fileName: 'Budget_Forecast_2024.xlsx',
    rfidTag: 'RFID008',
    issuedTo: 'Mr. Christopher Lee',
    issuedBy: 'Admin User',
    issueDate: new Date('2024-01-11T10:00:00'),
    expectedReturnDate: new Date('2024-01-18T17:00:00'),
    issueLocation: locations[7],
    status: 'issued',
    notes: 'Budget planning session'
  }
];
