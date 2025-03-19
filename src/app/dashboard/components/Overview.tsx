import { useState, useEffect } from 'react';
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
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

// Interface definitions to match other components
interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  location: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

interface Member {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  selectedServices: string[];
  additionalInfo: string | null;
  createdAt: string;
}

interface Listing {
  id: string;
  title: string;
  featuredImage: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  description?: string;
  typeOfPlace?: string;
}

// Generate labels for the last 7 days
const generateLastSevenDaysLabels = (): string[] => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Start from 6 days ago
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(dayNames[date.getDay()]);
  }
  
  return days;
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
      callbacks: {
        afterLabel: function(context: any) {
          return 'Includes all booking statuses';
        }
      }
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

export default function Overview() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { 
      title: 'Total Properties', 
      value: '91', 
      icon: <Building className="h-6 w-6 text-indigo-600" />,
      color: 'bg-indigo-50',
      path: '/dashboard/properties'
    },
    { 
      title: 'Active Bookings', 
      value: '0', 
      icon: <Calendar className="h-6 w-6 text-emerald-600" />,
      color: 'bg-emerald-50',
      path: '/dashboard/bookings'
    },
    { 
      title: 'Luxe Members', 
      value: '0', 
      icon: <Diamond className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-50',
      path: '/dashboard/members'
    },
    { 
      title: 'New Inquiries', 
      value: '0', 
      icon: <Mail className="h-6 w-6 text-amber-600" />,
      color: 'bg-amber-50',
      path: '/dashboard/inquiries'
    }
  ]);
  
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [chartData, setChartData] = useState({
    bookings: {
      labels: generateLastSevenDaysLabels(),
  datasets: [
    {
      label: 'Bookings',
          data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(52, 211, 153, 0.8)',
      borderColor: 'rgba(52, 211, 153, 1)',
      borderWidth: 1,
      borderRadius: 4,
      hoverBackgroundColor: 'rgba(52, 211, 153, 1)',
    },
  ],
    },
    inquiries: {
      labels: generateLastSevenDaysLabels(),
  datasets: [
    {
      label: 'Inquiries',
          data: [0, 0, 0, 0, 0, 0, 0],
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
    },
    memberships: {
      labels: generateLastSevenDaysLabels(),
  datasets: [
    {
      label: 'New Members',
          data: [0, 0, 0, 0, 0, 0, 0],
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
    }
  });
  
  const [todayActivity, setTodayActivity] = useState({
    bookings: { total: 0, confirmed: 0, pending: 0 },
    inquiries: { total: 0, },
    members: { total: 0 }
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // New endpoint to fetch all dashboard data at once
        const dashboardRes = await fetch('/api/dashboard/overview');
        if (!dashboardRes.ok) throw new Error('Failed to fetch dashboard data');
        
        const dashboardData = await dashboardRes.json();
        
        // Update stats with counts from the fetched data
        setStats([
  { 
    title: 'Total Properties', 
            value: '91', 
    icon: <Building className="h-6 w-6 text-indigo-600" />,
            color: 'bg-indigo-50',
            path: '/dashboard/properties'
  },
  { 
    title: 'Active Bookings', 
            value: dashboardData.bookings.length.toString(), 
    icon: <Calendar className="h-6 w-6 text-emerald-600" />,
            color: 'bg-emerald-50',
            path: '/dashboard/bookings'
  },
  { 
    title: 'Luxe Members', 
            value: dashboardData.members.length.toString(), 
    icon: <Diamond className="h-6 w-6 text-purple-600" />,
            color: 'bg-purple-50',
            path: '/dashboard/members'
  },
  { 
    title: 'New Inquiries', 
            value: dashboardData.inquiries.length.toString(), 
    icon: <Mail className="h-6 w-6 text-amber-600" />,
            color: 'bg-amber-50',
            path: '/dashboard/inquiries'
          }
        ]);
        
        // Process data for charts
        const chartData = processChartData(dashboardData);
        setChartData(chartData);
        
        // Get today's activity
        const todayActivity = processTodayActivity(dashboardData);
        setTodayActivity(todayActivity);
        
        // Set recent bookings (replacing recent listings)
        setRecentBookings(dashboardData.bookings.slice(0, 3));
        
        // Set recent members
        setRecentMembers(dashboardData.members.slice(0, 2));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Helper function to process chart data
    const processChartData = (data: any) => {
      const labels = generateLastSevenDaysLabels();
      const weekData = {
        bookings: Array(7).fill(0),
        inquiries: Array(7).fill(0),
        memberships: Array(7).fill(0)
      };
      
      // Calculate days ago for each date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Process bookings data
      data.bookings.forEach((booking: Booking) => {
        const createdDate = new Date(booking.createdAt);
        createdDate.setHours(0, 0, 0, 0);
        const daysAgo = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysAgo >= 0 && daysAgo < 7) {
          weekData.bookings[6 - daysAgo]++;
        }
      });
      
      // Process inquiries data
      data.inquiries.forEach((inquiry: Inquiry) => {
        const createdDate = new Date(inquiry.createdAt);
        createdDate.setHours(0, 0, 0, 0);
        const daysAgo = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysAgo >= 0 && daysAgo < 7) {
          weekData.inquiries[6 - daysAgo]++;
        }
      });
      
      // Process members data
      data.members.forEach((member: Member) => {
        const createdDate = new Date(member.createdAt);
        createdDate.setHours(0, 0, 0, 0);
        const daysAgo = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysAgo >= 0 && daysAgo < 7) {
          weekData.memberships[6 - daysAgo]++;
        }
      });
      
      return {
        bookings: {
          labels,
          datasets: [
            {
              label: 'Bookings',
              data: weekData.bookings,
              backgroundColor: 'rgba(52, 211, 153, 0.8)',
              borderColor: 'rgba(52, 211, 153, 1)',
              borderWidth: 1,
              borderRadius: 4,
              hoverBackgroundColor: 'rgba(52, 211, 153, 1)',
            },
          ],
        },
        inquiries: {
          labels,
          datasets: [
            {
              label: 'Inquiries',
              data: weekData.inquiries,
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
        },
        memberships: {
          labels,
          datasets: [
            {
              label: 'New Members',
              data: weekData.memberships,
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
        }
      };
    };
    
    // Helper function to process today's activity
    const processTodayActivity = (data: any) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Filter for today's bookings
      const todayBookings = data.bookings.filter((booking: Booking) => {
        const createdDate = new Date(booking.createdAt);
        return createdDate >= today;
      });
      
      const confirmedBookings = todayBookings.filter((booking: Booking) => booking.status === 'confirmed');
      const pendingBookings = todayBookings.filter((booking: Booking) => booking.status === 'pending');
      
      // Filter for today's inquiries
      const todayInquiries = data.inquiries.filter((inquiry: Inquiry) => {
        const createdDate = new Date(inquiry.createdAt);
        return createdDate >= today;
      });
      
      // Count inquiries for Bangkok
      const bangkokInquiries = todayInquiries.filter((inquiry: Inquiry) => 
        inquiry.location.toLowerCase().includes('bangkok')
      );
      
      // Count inquiries for beach destinations
      const beachInquiries = todayInquiries.filter((inquiry: Inquiry) => 
        inquiry.location.toLowerCase().includes('beach')
      );
      
      // Filter for today's members
      const todayMembers = data.members.filter((member: Member) => {
        const createdDate = new Date(member.createdAt);
        return createdDate >= today;
      });
      
      return {
        bookings: { 
          total: todayBookings.length, 
          confirmed: confirmedBookings.length, 
          pending: pendingBookings.length 
        },
        inquiries: { 
          total: todayInquiries.length, 
          forBangkok: bangkokInquiries.length, 
          forBeach: beachInquiries.length 
        },
        members: { 
          total: todayMembers.length 
        }
      };
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <span className="ml-3 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle className="h-8 w-8 mr-2" />
          <h3 className="text-xl font-medium">Error Loading Dashboard</h3>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            onClick={() => window.dispatchEvent(new CustomEvent('set-active-tab', { detail: stat.path.replace('/dashboard/', '') }))}
            className={`${stat.color} rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow`}
          >
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
              data={chartData.bookings} 
              options={barChartOptions}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Total: {chartData.bookings.datasets[0].data.reduce((a, b) => a + b, 0)} bookings this week</p>
          </div>
        </div>

        {/* Inquiries Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vacation Inquiries</h3>
          <div className="h-60">
            <Line 
              data={chartData.inquiries} 
              options={lineChartOptions}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Total: {chartData.inquiries.datasets[0].data.reduce((a, b) => a + b, 0)} inquiries this week</p>
          </div>
        </div>

        {/* Memberships Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">New Luxe Members</h3>
          <div className="h-60">
            <Line 
              data={chartData.memberships} 
              options={lineChartOptions}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Total: {chartData.memberships.datasets[0].data.reduce((a, b) => a + b, 0)} new members this week</p>
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
            <div 
              className="border border-gray-200 rounded-lg p-4 hover:bg-emerald-50 transition-colors cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'bookings' }))}
            >
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                <h4 className="font-medium text-gray-900">New Bookings</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{todayActivity.bookings.total}</p>
              <div className="text-sm text-gray-500">
                <p>{todayActivity.bookings.confirmed} confirmed</p>
                <p>{todayActivity.bookings.pending} pending approval</p>
              </div>
            </div>

            {/* Today's Inquiries */}
            <div 
              className="border border-gray-200 rounded-lg p-4 hover:bg-amber-50 transition-colors cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'inquiries' }))}
            >
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-amber-500 mr-2" />
                <h4 className="font-medium text-gray-900">New Inquiries</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{todayActivity.inquiries.total}</p>
              <div className="text-sm text-gray-500">
                <p>New vacation inquiries</p>
                <p>received this week</p>
              </div>
            </div>

            {/* Today's Members */}
            <div 
              className="border border-gray-200 rounded-lg p-4 hover:bg-purple-50 transition-colors cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'members' }))}
            >
              <div className="flex items-center mb-4">
                <Diamond className="h-5 w-5 text-purple-500 mr-2" />
                <h4 className="font-medium text-gray-900">New Members</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{todayActivity.members.total}</p>
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
        {/* Recent Bookings - Replacing Recent Listings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
            <span 
              className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'bookings' }))}
            >
              View all
            </span>
          </div>
          {recentBookings.length > 0 ? (
          <ul className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <li key={booking.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.propertyName || 'Property Booking'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {booking.guestName} • {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                      <button 
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'bookings' }));
                          // Store the booking ID in sessionStorage to be accessed by the bookings component
                          sessionStorage.setItem('view_booking_id', booking.id);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No bookings yet</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'bookings' }))}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Create New Booking
              </button>
            </div>
          )}
        </div>

        {/* Recent Luxe Members */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Luxe Members</h3>
            <span 
              className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'members' }))}
            >
              View all
            </span>
          </div>
          {recentMembers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentMembers.map((member) => (
              <li key={member.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {member.name?.charAt(0) || '?'}
                      </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {member.email || member.phone || 'No contact info'} • {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                      <button 
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'members' }));
                          // Store the member ID in sessionStorage to be accessed by the members component
                          sessionStorage.setItem('view_member_id', member.id);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                      View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No luxe members yet</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('set-active-tab', { detail: 'members' }))}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Add Your First Member
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 