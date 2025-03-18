import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Mail, 
  CheckCircle, 
  Clock, 
  Bell, 
  MapPin, 
  Calendar, 
  Users, 
  Diamond, 
  Search 
} from 'lucide-react';

// Mock data for charts
const mockChartData = {
  inquiries: [8, 11, 5, 9, 7, 12, 10]
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
const inquiriesChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Inquiries',
      data: mockChartData.inquiries,
      borderColor: 'rgba(251, 191, 36, 1)',
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgba(251, 191, 36, 1)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3,
    },
  ],
};

// Vacation inquiries
const vacationInquiries = [
  {
    id: 'inquiry-001',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '+66 111 222 333',
    location: 'Phuket',
    dates: '2024-01-15 to 2024-01-25',
    guests: 6,
    budget: '$2000-$3000',
    message: 'Looking for a beachfront villa with a private pool for a family vacation.',
    createdAt: '2023-11-28T09:20:00Z',
    status: 'new'
  },
  {
    id: 'inquiry-002',
    name: 'Lisa Wang',
    email: 'lisa@example.com',
    phone: '+66 444 555 666',
    location: 'Koh Samui',
    dates: '2024-02-10 to 2024-02-17',
    guests: 2,
    budget: '$1000-$1500',
    message: 'Interested in a romantic getaway with ocean views.',
    createdAt: '2023-11-26T15:45:00Z',
    status: 'contacted'
  },
  {
    id: 'inquiry-003',
    name: 'Mark Davis',
    email: 'mark@example.com',
    phone: '+66 777 888 999',
    location: 'Chiang Mai',
    dates: '2024-01-05 to 2024-01-12',
    guests: 4,
    budget: '$800-$1200',
    message: 'Looking for a property near the old city with cultural experiences.',
    createdAt: '2023-11-24T11:30:00Z',
    status: 'resolved'
  }
];

export default function Inquiries() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-6">Vacation Inquiries Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Mail className="h-5 w-5 text-amber-600 mr-2" />
              <h4 className="font-medium text-gray-900">Total Inquiries</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{vacationInquiries.length}</p>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
              <h4 className="font-medium text-gray-900">Resolved</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {vacationInquiries.filter(i => i.status === 'resolved').length}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">Contacted</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {vacationInquiries.filter(i => i.status === 'contacted').length}
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Bell className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="font-medium text-gray-900">New</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {vacationInquiries.filter(i => i.status === 'new').length}
            </p>
          </div>
        </div>
        
        {/* Inquiry Chart */}
        <div className="h-60 mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Weekly Inquiry Trend</h4>
          <Line 
            data={inquiriesChartData} 
            options={lineChartOptions}
          />
        </div>
      </div>
      
      {/* Inquiries Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">All Inquiries</h3>
          <div className="relative rounded-md w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="Search inquiries..."
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
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vacationInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-medium">
                        {inquiry.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{inquiry.location}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{inquiry.dates}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{inquiry.guests} guests</span>
                      </div>
                      <div className="flex items-center">
                        <Diamond className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{inquiry.budget}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 max-w-xs truncate">{inquiry.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString()} at {new Date(inquiry.createdAt).toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${inquiry.status === 'new' ? 'bg-red-100 text-red-800' : 
                        inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-amber-600 hover:text-amber-900 mr-3">Contact</button>
                    <button className="text-emerald-600 hover:text-emerald-900">Resolve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{vacationInquiries.length}</span> inquiries
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