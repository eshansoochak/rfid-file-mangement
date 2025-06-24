import React from 'react';
import { FileRecord } from '../types';
import { FileText, Users, Building2, Clock } from 'lucide-react';

interface StatsCardsProps {
  files: FileRecord[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ files }) => {
  const stats = React.useMemo(() => {
    const totalFiles = files.length;
    const activeFiles = files.filter(f => f.status === 'available').length;
    const checkedOutFiles = files.filter(f => f.status === 'checked-out').length;
    const uniqueUsers = new Set(files.map(f => f.accessedBy)).size;
    const recentFiles = files.filter(f => {
      const daysDiff = (Date.now() - f.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    return {
      totalFiles,
      activeFiles,
      checkedOutFiles,
      uniqueUsers,
      recentFiles
    };
  }, [files]);

  const cards = [
    {
      title: 'Total Files',
      value: stats.totalFiles,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Available Files',
      value: stats.activeFiles,
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Checked Out',
      value: stats.checkedOutFiles,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Active Users',
      value: stats.uniqueUsers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};