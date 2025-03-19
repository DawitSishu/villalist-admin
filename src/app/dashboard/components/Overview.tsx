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
      value: '0', 
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
  
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
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
    inquiries: { total: 0, forBangkok: 0, forBeach: 0 },
    members: { total: 0 }
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchOverviewData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch properties count
        const propertiesRes = await fetch('/api/listings/count');
        if (!propertiesRes.ok) throw new Error('Failed to fetch properties data');
        const propertiesData = await propertiesRes.json();
        
        // Fetch active bookings count
        const bookingsRes = await fetch('/api/bookings/count?status=confirmed');
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings data');
        const bookingsData = await bookingsRes.json();
        
        // Fetch members count
        const membersRes = await fetch('/api/luxe-memberships/count');
        if (!membersRes.ok) throw new Error('Failed to fetch members data');
        const membersData = await membersRes.json();
        
        // Fetch new inquiries count
        const inquiriesRes = await fetch('/api/inquiries/count?status=new');
        if (!inquiriesRes.ok) throw new Error('Failed to fetch inquiries data');
        const inquiriesData = await inquiriesRes.json();
        
        // Update stats
        setStats([
          { 
            title: 'Total Properties', 
            value: propertiesData.count.toString(), 
            icon: <Building className="h-6 w-6 text-indigo-600" />,
            color: 'bg-indigo-50',
            path: '/dashboard/properties'
          },
          { 
            title: 'Active Bookings', 
            value: bookingsData.count.toString(), 
            icon: <Calendar className="h-6 w-6 text-emerald-600" />,
            color: 'bg-emerald-50',
            path: '/dashboard/bookings'
          },
          { 
            title: 'Luxe Members', 
            value: membersData.count.toString(), 
            icon: <Diamond className="h-6 w-6 text-purple-600" />,
            color: 'bg-purple-50',
            path: '/dashboard/members'
          },
          { 
            title: 'New Inquiries', 
            value: inquiriesData.count.toString(), 
            icon: <Mail className="h-6 w-6 text-amber-600" />,
            color: 'bg-amber-50',
            path: '/dashboard/inquiries'
          }
        ]);
        
        // Fetch chart data
        const chartRes = await fetch('/api/dashboard/charts');
        if (!chartRes.ok) throw new Error('Failed to fetch chart data');
        const chartData = await chartRes.json();
        setChartData(chartData);
        
        // Fetch today's activity
        const todayRes = await fetch('/api/dashboard/today');
        if (!todayRes.ok) throw new Error('Failed to fetch today\'s activity data');
        const todayData = await todayRes.json();
        setTodayActivity(todayData);
        
        // Fetch recent listings
        const recentListingsRes = await fetch('/api/listings?limit=3&sort=createdAt:desc');
        if (!recentListingsRes.ok) throw new Error('Failed to fetch recent listings');
        const recentListingsData = await recentListingsRes.json();
        setRecentListings(recentListingsData.listings);
        
        // Fetch recent members
        const recentMembersRes = await fetch('/api/luxe-memberships?limit=2&sort=createdAt:desc');
        if (!recentMembersRes.ok) throw new Error('Failed to fetch recent members');
        const recentMembersData = await recentMembersRes.json();
        setRecentMembers(recentMembersData.members);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOverviewData();
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
          <Link href={stat.path} key={index}>
            <div className={`${stat.color} rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow`}>
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
          </Link>
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
            <Link href="/dashboard/bookings">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-emerald-50 transition-colors">
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
            </Link>

            {/* Today's Inquiries */}
            <Link href="/dashboard/inquiries">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-amber-50 transition-colors">
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-amber-500 mr-2" />
                  <h4 className="font-medium text-gray-900">New Inquiries</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{todayActivity.inquiries.total}</p>
                <div className="text-sm text-gray-500">
                  <p>{todayActivity.inquiries.forBangkok} for Bangkok properties</p>
                  <p>{todayActivity.inquiries.forBeach} for beach destinations</p>
                </div>
              </div>
            </Link>

            {/* Today's Members */}
            <Link href="/dashboard/members">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-purple-50 transition-colors">
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
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Listings</h3>
            <Link href="/dashboard/properties">
              <span className="text-sm text-indigo-600 hover:text-indigo-800">View all</span>
            </Link>
          </div>
          {recentListings.length > 0 ? (
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
                      <Link href={`/dashboard/properties?edit=${listing.id}`}>
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No properties listed yet</p>
              <Link href="/dashboard/properties/new">
                <button className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Add Your First Property
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Luxe Members */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Luxe Members</h3>
            <Link href="/dashboard/members">
              <span className="text-sm text-indigo-600 hover:text-indigo-800">View all</span>
            </Link>
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
                      <Link href={`/dashboard/members?view=${member.id}`}>
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No luxe members yet</p>
              <Link href="/dashboard/members/new">
                <button className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  Add Your First Member
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 