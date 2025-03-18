import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Diamond, Globe, Users, Search, Mail, Phone, Loader2, X, AlertTriangle } from 'lucide-react';

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

// Updated mock data to match LuxeMembership schema
const recentMembers = [
  {
    id: 'member-001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: null,
    selectedServices: ['Airport Transfer', 'Personal Chef', 'Yacht Charter'],
    createdAt: '2023-10-15T10:30:00Z',
    additionalInfo: 'Prefers services in the morning'
  },
  {
    id: 'member-002',
    name: 'Michael Chen',
    email: null,
    phone: '+66 987 654 321',
    selectedServices: ['Private Tour Guide', 'Spa Services'],
    createdAt: '2023-11-02T14:45:00Z',
    additionalInfo: 'Allergic to seafood'
  }
];

// Define types for members and services
interface Member {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  selectedServices: string[];
  additionalInfo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ServiceCount {
  name: string;
  count: number;
}

// Helper function to generate a human-readable date range text
function getDateRangeText(): string {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  
  const formatDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  return `${formatDate(sevenDaysAgo)} - ${formatDate(today)}`;
}

export default function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  
  // Generate labels for the last 7 days ending today
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
  
  const [weeklyData, setWeeklyData] = useState(() => {
    const labels = generateLastSevenDaysLabels();
    
    return {
      labels,
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
    };
  });

  // New state for modals
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch members data from the database
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/luxe-memberships');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data.members);
        
        // Process weekly data for the chart
        const weeklySignups = processWeeklySignups(data.members);
        setWeeklyData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: weeklySignups
          }]
        }));
      } catch (error) {
        console.error('Error fetching members:', error);
        // If fetch fails, use the mock data
        setMembers(recentMembers as Member[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Updated helper function to process weekly signups for the chart
  const processWeeklySignups = (membersData: Member[]): number[] => {
    const dayCount: number[] = [0, 0, 0, 0, 0, 0, 0];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // Starting from 6 days ago
      date.setHours(0, 0, 0, 0); // Set to start of day
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1); // End of the day
      
      // Count members who signed up on this specific day
      const count = membersData.filter(member => {
        const createdDate = new Date(member.createdAt);
        return createdDate >= date && createdDate < nextDate;
      }).length;
      
      dayCount[i] = count;
    }
    
    return dayCount;
  };

  // Get members who joined this month
  const getNewMembersThisMonth = (): number => {
    const now = new Date();
    return members.filter(m => {
      const date = new Date(m.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
  };

  // Get total number of services across all members
  const getTotalServices = (): number => {
    return members.reduce((total, member) => total + member.selectedServices.length, 0);
  };

  // Get popular services with counts
  const getPopularServices = (): ServiceCount[] => {
    const services: Record<string, number> = {};
    members.forEach(member => {
      member.selectedServices.forEach(service => {
        services[service] = (services[service] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    return Object.entries(services)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 services
  };
  
  const popularServices = getPopularServices();

  // Delete member function
  const deleteMember = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/luxe-memberships/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      
      // Remove the deleted member from state
      const updatedMembers = members.filter(member => member.id !== id);
      setMembers(updatedMembers);
      
      // Update the weekly data chart
      const updatedWeeklySignups = processWeeklySignups(updatedMembers);
      setWeeklyData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: updatedWeeklySignups
        }]
      }));
      
      setDeleteConfirmMember(null);
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <span className="ml-4 text-lg font-medium text-gray-600">Loading membership data...</span>
      </div>
    );
  }

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
            <p className="text-2xl font-bold text-gray-900">{members.length}</p>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Globe className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium text-gray-900">Active Services</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{getTotalServices()}</p>
          </div>
          
          <div className="bg-pink-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-pink-600 mr-2" />
              <h4 className="font-medium text-gray-900">New This Month</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{getNewMembersThisMonth()}</p>
          </div>
        </div>
        
        {/* Memberships Chart - Updated title to show date range */}
        <div className="h-60 mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            New Memberships Trend ({getDateRangeText()})
          </h4>
          <Line 
            data={weeklyData} 
            options={lineChartOptions}
          />
        </div>
      </div>
      
      {/* Popular Services */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Luxe Services</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-purple-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <Diamond className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-sm text-gray-500">
                {service.count} {service.count === 1 ? 'member' : 'members'}
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
                  Additional Info
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
              {members
                .filter(member => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    (member.name?.toLowerCase().includes(query)) ||
                    (member.email?.toLowerCase().includes(query)) ||
                    (member.phone?.toLowerCase().includes(query))
                  );
                })
                .map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {member.name?.charAt(0) || '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">ID: {member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {member.email && (
                        <div className="flex items-center mb-1">
                          <Mail className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {!member.email && !member.phone && (
                        <span className="text-gray-400 italic">No contact provided</span>
                      )}
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {member.additionalInfo || 'No additional information'}
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
                    <button 
                      onClick={() => setViewMember(member)} 
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmMember(member)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{members.length}</span> members
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

      {/* View Member Modal */}
      {viewMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900">Member Details</h3>
              <button 
                onClick={() => setViewMember(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Member Avatar and Name */}
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xl font-medium">
                  {viewMember.name?.charAt(0) || '?'}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-gray-900">{viewMember.name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-500">ID: {viewMember.id}</p>
                  <p className="text-sm text-gray-500">Joined: {new Date(viewMember.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">Contact Information</h4>
                {viewMember.email && (
                  <div className="flex items-center mb-2">
                    <Mail className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{viewMember.email}</span>
                  </div>
                )}
                {viewMember.phone && (
                  <div className="flex items-center mb-2">
                    <Phone className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{viewMember.phone}</span>
                  </div>
                )}
                {!viewMember.email && !viewMember.phone && (
                  <p className="text-gray-500 italic">No contact information provided</p>
                )}
              </div>

              {/* Selected Services */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">Selected Services</h4>
                <div className="flex flex-wrap gap-2">
                  {viewMember.selectedServices.length > 0 ? (
                    viewMember.selectedServices.map((service, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                        {service}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No services selected</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">Additional Information</h4>
                <p className="text-gray-700">
                  {viewMember.additionalInfo || 'No additional information provided'}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 flex justify-end">
              <button
                onClick={() => setViewMember(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the membership for{' '}
                <span className="font-semibold">{deleteConfirmMember.name || 'this member'}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirmMember(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMember(deleteConfirmMember.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 