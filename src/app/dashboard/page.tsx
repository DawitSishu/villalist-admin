'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Icons
import { 
  Home, 
  Building, 
  Users, 
  Menu, 
  X, 
  LogOut, 
  PlusCircle, 
  Search,
  Bed,
  Bath,
  MapPin,
  Diamond,
  BarChart2,
  Calendar,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  Globe,
  Mail,
  Phone,
} from 'lucide-react';

// Mock data for charts
const mockChartData = {
  bookings: [12, 19, 8, 15, 12, 8, 16],
  inquiries: [8, 11, 5, 9, 7, 12, 10],
  memberships: [2, 1, 0, 3, 1, 2, 1]
};

// Chart labels
const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Bookings data
  const bookings = [
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Chart.js options
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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
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
      case 'properties':
        return (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">All Properties</h3>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Property
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="Search properties by title, address, or ID..."
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
                        Property
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative rounded overflow-hidden">
                              <Image 
                                src={listing.featuredImage} 
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                              <div className="text-sm text-gray-500">ID: {listing.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{listing.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${listing.pricePerNight}/night</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <span className="flex items-center">
                              <Bed className="h-3 w-3 mr-1" />
                              {listing.bedrooms}
                            </span>
                            <span className="flex items-center">
                              <Bath className="h-3 w-3 mr-1" />
                              {listing.bathrooms}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {listing.maxGuests}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'members':
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
      case 'bookings':
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
      case 'inquiries':
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
      default:
        return <div>Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 pt-8 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">BKK Luxe Admin</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                activeTab === 'properties'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Building className="h-5 w-5 mr-3" />
              Property Management
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                activeTab === 'members'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Diamond className="h-5 w-5 mr-3" />
              Luxe Memberships
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                activeTab === 'bookings'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Bookings
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                activeTab === 'inquiries'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Mail className="h-5 w-5 mr-3" />
              Vacation Inquiries
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
} 