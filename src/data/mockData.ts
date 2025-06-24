import { FileRecord, Department } from '../types';

export const departments: Department[] = [
  { id: '1', name: 'Human Resources', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Finance', color: 'bg-green-100 text-green-800' },
  { id: '3', name: 'Legal', color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Operations', color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Marketing', color: 'bg-pink-100 text-pink-800' },
  { id: '6', name: 'IT', color: 'bg-indigo-100 text-indigo-800' },
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
    status: 'available'
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
    status: 'checked-out'
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
    status: 'available'
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
    status: 'available'
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
    status: 'available'
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
    status: 'archived'
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
    status: 'available'
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
    status: 'checked-out'
  }
];