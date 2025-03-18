import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users, 
  Diamond, 
  Search 
} from 'lucide-react';

// Booking schema model
interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

// Mock data for charts
const mockChartData = {
  bookings: [12, 19, 8, 15, 12, 8, 16]
};

// Chart options
const barChartOptions = {
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
const bookingsChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Bookings',
      data: mockChartData.bookings,
      backgroundColor: 'rgba(52, 211, 153, 0.8)',
      borderColor: 'rgba(52, 211, 153, 1)',
      borderWidth: 1,
      borderRadius: 4,
      hoverBackgroundColor: 'rgba(52, 211, 153, 1)',
    },
  ],
};

// Bookings data
const bookings: Booking[] = [
  {
    id: 'booking-001',
    propertyId: 'luxury-villa-123',
    propertyName: 'Luxury Villa with Pool',
    guestName: 'David Thompson',
    guestEmail: 'david@example.com',
    checkIn: '2023-12-15',
    checkOut: '2023-12-20',
    guests: 4,
    status: 'confirmed',
    totalAmount: 1750,
    createdAt: '2023-11-20T08:45:00Z'
  },
  {
    id: 'booking-002',
    propertyId: 'modern-condo-456',
    propertyName: 'Modern Condo in City Center',
    guestName: 'Emma Wilson',
    guestEmail: 'emma@example.com',
    checkIn: '2023-12-10',
    checkOut: '2023-12-13',
    guests: 2,
    status: 'pending',
    totalAmount: 360,
    createdAt: '2023-11-25T14:30:00Z'
  },
  {
    id: 'booking-003',
    propertyId: 'riverside-suite-789',
    propertyName: 'Riverside Suite with Balcony',
    guestName: 'James Lee',
    guestEmail: 'james@example.com',
    checkIn: '2023-12-22',
    checkOut: '2023-12-28',
    guests: 3,
    status: 'cancelled',
    totalAmount: 1200,
    createdAt: '2023-11-15T10:15:00Z'
  }
];

export default function Bookings() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-6">Bookings Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
              <h4 className="font-medium text-gray-900">Total Bookings</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">Confirmed</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <h4 className="font-medium text-gray-900">Pending</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="font-medium text-gray-900">Cancelled</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter(b => b.status === 'cancelled').length}
            </p>
          </div>
        </div>
        
        {/* Bookings Chart */}
        <div className="h-60 mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Weekly Booking Trend</h4>
          <Bar 
            data={bookingsChartData} 
            options={barChartOptions}
          />
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">All Bookings</h3>
          <div className="relative rounded-md w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="Search bookings..."
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
                  Guest
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
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
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-medium">
                        {booking.guestName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.propertyName}</div>
                    <div className="text-xs text-gray-500">ID: {booking.propertyId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span>Check-in: {booking.checkIn}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span>Check-out: {booking.checkOut}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{booking.guests} guests</span>
                      </div>
                      <div className="flex items-center">
                        <Diamond className="h-4 w-4 text-gray-500 mr-1" />
                        <span>${booking.totalAmount}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-emerald-600 hover:text-emerald-900 mr-3">Confirm</button>
                    <button className="text-red-600 hover:text-red-900">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{bookings.length}</span> bookings
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