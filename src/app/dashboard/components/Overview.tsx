import { useState } from 'react';
import Image from 'next/image';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Building, 
  Calendar, 
  Diamond, 
  Mail,
  BarChart2, 
  Users,
  Bed, 
  Bath, 
  Clock, 
  CheckCircle, 
  XCircle
} from 'lucide-react';

// Mock data for charts
const mockChartData = {
  bookings: [12, 19, 8, 15, 12, 8, 16],
  inquiries: [8, 11, 5, 9, 7, 12, 10],
  memberships: [2, 1, 0, 3, 1, 2, 1]
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

// Dashboard stats
const stats = [
  { 
    title: 'Total Properties', 
    value: '24', 
    icon: <Building className="h-6 w-6 text-indigo-600" />,
    color: 'bg-indigo-50'
  },
  { 
    title: 'Active Bookings', 
    value: '16', 
    icon: <Calendar className="h-6 w-6 text-emerald-600" />,
    color: 'bg-emerald-50'
  },
  { 
    title: 'Luxe Members', 
    value: '18', 
    icon: <Diamond className="h-6 w-6 text-purple-600" />,
    color: 'bg-purple-50'
  },
  { 
    title: 'New Inquiries', 
    value: '7', 
    icon: <Mail className="h-6 w-6 text-amber-600" />,
    color: 'bg-amber-50'
  }
];

// Mock data based on your schema
const recentListings = [
  {
    id: 'luxury-villa-123',
    title: 'Luxury Villa with Pool',
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    pricePerNight: 350,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    address: 'Sukhumvit, Bangkok'
  },
  {
    id: 'modern-condo-456',
    title: 'Modern Condo in City Center',
    featuredImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    pricePerNight: 120,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    address: 'Silom, Bangkok'
  },
  {
    id: 'riverside-suite-789',
    title: 'Riverside Suite with Balcony',
    featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    pricePerNight: 200,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    address: 'Riverside, Bangkok'
  }
];

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

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="rounded-full p-3 bg-white shadow-sm">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Bookings</h3>
          <div className="h-60">
            <Bar 
              data={bookingsChartData} 
              options={barChartOptions}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Total: {mockChartData.bookings.reduce((a, b) => a + b, 0)} bookings this week</p>
          </div>
        </div>

        {/* Inquiries Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vacation Inquiries</h3>
          <div className="h-60">
            <Line 
              data={inquiriesChartData} 
              options={lineChartOptions}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Total: {mockChartData.inquiries.reduce((a, b) => a + b, 0)} inquiries this week</p>
          </div>
        </div>

        {/* Memberships Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">New Luxe Members</h3>
          <div className="h-60">
            <Line 
              data={membershipsChartData} 
              options={lineChartOptions}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Total: {mockChartData.memberships.reduce((a, b) => a + b, 0)} new members this week</p>
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Today's Activity</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today's Bookings */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                <h4 className="font-medium text-gray-900">New Bookings</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">3</p>
              <div className="text-sm text-gray-500">
                <p>2 confirmed</p>
                <p>1 pending approval</p>
              </div>
            </div>

            {/* Today's Inquiries */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-amber-500 mr-2" />
                <h4 className="font-medium text-gray-900">New Inquiries</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">5</p>
              <div className="text-sm text-gray-500">
                <p>3 for Bangkok properties</p>
                <p>2 for beach destinations</p>
              </div>
            </div>

            {/* Today's Members */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Diamond className="h-5 w-5 text-purple-500 mr-2" />
                <h4 className="font-medium text-gray-900">New Members</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">1</p>
              <div className="text-sm text-gray-500">
                <p>Interested in premium services</p>
                <p>Requires follow-up</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Listings</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentListings.map((listing) => (
              <li key={listing.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 relative rounded-md overflow-hidden">
                    <Image 
                      src={listing.featuredImage} 
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {listing.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      ${listing.pricePerNight}/night • {listing.bedrooms} BR • {listing.bathrooms} BA
                    </p>
                  </div>
                  <div>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Luxe Members */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Luxe Members</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentMembers.map((member) => (
              <li key={member.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {member.email} • {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                      View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 