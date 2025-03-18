import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Diamond, Globe, Users, Search, Mail, Phone } from 'lucide-react';

// Mock data for charts
const mockChartData = {
  memberships: [2, 1, 0, 3, 1, 2, 1]
};

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 10,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
};

// Chart data
const membershipsChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'New Members',
      data: mockChartData.memberships,
      borderColor: 'rgba(168, 85, 247, 1)',
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      borderWidth: 2,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgba(168, 85, 247, 1)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3,
      fill: true,
    },
  ],
};

const recentMembers = [
  {
    id: 'member-001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+66 123 456 789',
    selectedServices: ['Airport Transfer', 'Personal Chef', 'Yacht Charter'],
    createdAt: '2023-10-15T10:30:00Z'
  },
  {
    id: 'member-002',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+66 987 654 321',
    selectedServices: ['Private Tour Guide', 'Spa Services'],
    createdAt: '2023-11-02T14:45:00Z'
  }
];

export default function Members() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-6">Luxe Membership Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Diamond className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-gray-900">Total Members</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{recentMembers.length}</p>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Globe className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium text-gray-900">Active Services</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {recentMembers.reduce((total, member) => total + member.selectedServices.length, 0)}
            </p>
          </div>
          
          <div className="bg-pink-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-pink-600 mr-2" />
              <h4 className="font-medium text-gray-900">New This Month</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {recentMembers.filter(m => {
                const date = new Date(m.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
        
        {/* Memberships Chart */}
        <div className="h-60 mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">New Memberships Trend</h4>
          <Line 
            data={membershipsChartData} 
            options={lineChartOptions}
          />
        </div>
      </div>
      
      {/* Popular Services */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Luxe Services</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Airport Transfer', 'Personal Chef', 'Yacht Charter', 'Private Tour Guide', 'Spa Services'].map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-purple-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{service}</h4>
                <Diamond className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-sm text-gray-500">
                {recentMembers.filter(m => m.selectedServices.includes(service)).length} members
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">All Luxe Members</h3>
          <div className="relative rounded-md w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-500">ID: {member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Mail className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {member.selectedServices.map((service, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          {service}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(member.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-purple-600 hover:text-purple-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{recentMembers.length}</span> members
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 