import { useState, useEffect, Fragment } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Mail, 
  CheckCircle, 
  Clock, 
  Bell, 
  MapPin, 
  Calendar, 
  Users, 
  Search,
  Loader2,
  X
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

// Define Inquiry interface
interface InquiryType {
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

export default function Inquiries() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vacationInquiries, setVacationInquiries] = useState<InquiryType[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryType | null>(null);
  
  // Loading states for action buttons
  const [resolvingInquiryId, setResolvingInquiryId] = useState<string | null>(null);

  // Fetch inquiries data
  useEffect(() => {
    const fetchInquiries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/inquiries');
        
        if (!response.ok) {
          throw new Error('Failed to fetch inquiries');
        }
        
        const data = await response.json();
        
        // Transform dates from database format
        const formattedInquiries: InquiryType[] = data.inquiries.map((inquiry: any) => ({
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          location: inquiry.location,
          checkInDate: new Date(inquiry.checkInDate).toISOString().split('T')[0],
          checkOutDate: new Date(inquiry.checkOutDate).toISOString().split('T')[0],
          guests: inquiry.guests,
          createdAt: inquiry.createdAt,
          status: inquiry.status
        }));
        
        setVacationInquiries(formattedInquiries);
        setWeeklyData(data.weeklyData);
      } catch (err) {
        console.error('Error fetching inquiries:', err);
        setError('Failed to load inquiries. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInquiries();
  }, []);

  // Handle view inquiry in popup
  const handleViewInquiry = (inquiry: InquiryType) => {
    setSelectedInquiry(inquiry);
    setIsViewModalOpen(true);
  };

  // Handle contact inquiry (open email client)
  const handleContactInquiry = (inquiry: InquiryType) => {
    const subject = `Regarding your vacation inquiry for ${inquiry.location}`;
    const body = `Hello ${inquiry.name},\n\nThank you for your interest in visiting ${inquiry.location}.\n\nWe received your inquiry for ${inquiry.guests} guests from ${inquiry.checkInDate} to ${inquiry.checkOutDate}.\n\nHow can we help you plan your perfect vacation?`;
    
    window.location.href = `mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // If the inquiry status is 'new', automatically update it to 'contacted'
    if (inquiry.status === 'new') {
      handleUpdateInquiryStatus(inquiry.id, 'contacted');
    }
  };

  // Handle resolve inquiry (update in DB)
  const handleResolveInquiry = async (inquiryId: string) => {
    setResolvingInquiryId(inquiryId);
    
    try {
      await handleUpdateInquiryStatus(inquiryId, 'resolved');
    } finally {
      setResolvingInquiryId(null);
    }
  };
  
  // API call to update inquiry status
  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: 'new' | 'contacted' | 'resolved') => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update inquiry status');
      }
      
      // Update local state to reflect the change
      setVacationInquiries(prevInquiries => 
        prevInquiries.map(inquiry => 
          inquiry.id === inquiryId 
            ? { ...inquiry, status: newStatus } 
            : inquiry
        )
      );
      
    } catch (err) {
      console.error('Error updating inquiry status:', err);
      // You could show an error toast here
    }
  };

  // Chart data
  const inquiriesChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Inquiries',
        data: weeklyData,
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading inquiries data...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-medium text-red-800 mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

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
        
        {vacationInquiries.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No inquiries found</p>
          </div>
        ) : (
          <>
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
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vacationInquiries
                    .filter(inquiry => 
                      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      inquiry.location.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-medium">
                            {inquiry.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                            <div className="text-sm text-gray-500">{inquiry.email}</div>
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
                            <span>{inquiry.checkInDate} to {inquiry.checkOutDate}</span>
                          </div>
                          <div className="flex items-center mb-1">
                            <Users className="h-4 w-4 text-gray-500 mr-1" />
                            <span>{inquiry.guests} guests</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            Created: {new Date(inquiry.createdAt).toLocaleDateString()}
                          </div>
                        </div>
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
                        <button 
                          onClick={() => handleViewInquiry(inquiry)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleContactInquiry(inquiry)}
                          className="text-amber-600 hover:text-amber-900 mr-3"
                        >
                          Contact
                        </button>
                        {resolvingInquiryId === inquiry.id ? (
                          <span className="inline-flex">
                            <Loader2 className="h-4 w-4 text-emerald-600 animate-spin" />
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleResolveInquiry(inquiry.id)}
                            className={`text-emerald-600 hover:text-emerald-900 ${inquiry.status === 'resolved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={inquiry.status === 'resolved'}
                          >
                            {inquiry.status === 'resolved' ? 'Resolved' : 'Resolve'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">
                    {vacationInquiries.filter(inquiry => 
                      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      inquiry.location.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length}
                  </span> of <span className="font-medium">{vacationInquiries.length}</span> inquiries
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
          </>
        )}
      </div>
      
      {/* View Inquiry Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsViewModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-start">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Inquiry Details
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsViewModalOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {selectedInquiry && (
                    <div className="mt-4">
                      <div className="mb-6 flex items-center">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-medium">
                          {selectedInquiry.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{selectedInquiry.name}</h4>
                          <p className="text-gray-500">{selectedInquiry.email}</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 text-amber-600 mr-1" />
                              <p className="text-gray-900 font-medium">{selectedInquiry.location}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Guests</p>
                            <div className="flex items-center mt-1">
                              <Users className="h-4 w-4 text-amber-600 mr-1" />
                              <p className="text-gray-900 font-medium">{selectedInquiry.guests} guests</p>
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Dates</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 text-amber-600 mr-1" />
                              <p className="text-gray-900 font-medium">
                                {selectedInquiry.checkInDate} to {selectedInquiry.checkOutDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span className={`px-2 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${selectedInquiry.status === 'new' ? 'bg-red-100 text-red-800' : 
                              selectedInquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1)}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Created</p>
                          <p className="text-gray-900 mt-1">{new Date(selectedInquiry.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6 space-x-3">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                          onClick={() => {
                            handleContactInquiry(selectedInquiry);
                            setIsViewModalOpen(false);
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </button>
                        
                        {selectedInquiry.status !== 'resolved' && (
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                            onClick={async () => {
                              setIsViewModalOpen(false);
                              await handleResolveInquiry(selectedInquiry.id);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}