import { useState, useEffect, useRef } from 'react';
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
import { startOfWeek, addDays } from 'date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

Chart.register(CategoryScale, ChartDataLabels);

// Booking schema model - update to match Prisma schema
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
    datalabels: {
      display: true,
      color: '#000',
      font: {
        weight: 'bold' as const,
      },
      formatter: (value: any) => {
        return value > 0 ? value : '';
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      suggestedMin: 1,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 11,
        },
        precision: 0,
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
  animation: {
    duration: 1000,
  },
  barPercentage: 0.6,
  categoryPercentage: 0.7,
};

export default function Bookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [displayedBookings, setDisplayedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add states for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const bookingsPerPage = 10;

  // Add states for stats
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [weeklyBookingData, setWeeklyBookingData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  // Add new state for the chart dates
  const [chartDates, setChartDates] = useState<string[]>([]);

  // Add new state for the view popup
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Add states for cancel confirmation
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const chartRef = useRef(null);

  // Add new state for the simple chart
  const [useSimpleChart, setUseSimpleChart] = useState(false);

  // Fetch all bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/bookings`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const data = await res.json();
        console.log("Bookings data:", data);
        setAllBookings(data.bookings);
        setTotalBookings(data.total);
        setConfirmedCount(data.stats.confirmed);
        setPendingCount(data.stats.pending);
        setCancelledCount(data.stats.cancelled);
        
        // Generate chart dates
        generateChartData(data.bookings);
      } catch (err) {
        setError('Error loading bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  // Filter bookings based on search query
  useEffect(() => {
    if (allBookings.length > 0) {
      // Filter bookings based on search query
      const filtered = searchQuery 
        ? allBookings.filter(booking => 
            booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : allBookings;
      
      setFilteredBookings(filtered);
      setTotalBookings(filtered.length);
      
      // Update pagination
      const startIndex = (currentPage - 1) * bookingsPerPage;
      const endIndex = startIndex + bookingsPerPage;
      setDisplayedBookings(filtered.slice(startIndex, endIndex));
      
      // Reset to first page if current page is now invalid
      if (filtered.length > 0 && startIndex >= filtered.length) {
        setCurrentPage(1);
      }
    }
  }, [searchQuery, allBookings, currentPage]);

  // Handle pagination changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    setDisplayedBookings(filteredBookings.slice(startIndex, endIndex));
  }, [currentPage, filteredBookings]);

  // Generate chart data from bookings
  const generateChartData = (bookings: Booking[]) => {
    // Get the current date and calculate current week's start/end dates
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6); // 6 days ago to include today = 7 days total
    
    // Create an array of the last 7 days (including today)
    const weekDays: Date[] = [];
    const weekDatesFormatted: string[] = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      weekDays.push(day);
      
      // Format as "Mon, 9/25"
      weekDatesFormatted.push(
        day.toLocaleDateString('en-US', { weekday: 'short' }) + 
        ', ' + 
        (day.getMonth() + 1) + '/' + day.getDate()
      );
    }
    
    setChartDates(weekDatesFormatted);
    
    // Initialize weeklyData with zeros
    const weeklyData = Array(7).fill(0);
    
    // Count bookings for each day of the week
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      bookingDate.setHours(0, 0, 0, 0); // Reset to start of day
      
      // Find the index of this date in our weekDays array
      for (let i = 0; i < 7; i++) {
        if (bookingDate.getTime() === weekDays[i].getTime()) {
          weeklyData[i]++;
          break;
        }
      }
    });
    
    console.log("Weekly data array:", weeklyData);
    setWeeklyBookingData(weeklyData);
  };

  // Format dates properly
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };
  
  // Format dates for chart labels (shorter format)
  const formatDateShort = (date: Date) => {
    // Format as "Day, M/D" to match the style in the screenshot
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',  // "Sat"
      month: 'numeric',  // "3"
      day: 'numeric'     // "15"
    });
  };

  // Effect to console.log chart data when it changes
  useEffect(() => {
    const logChartData = () => {
      if (chartDates.length > 0 && weeklyBookingData.length > 0) {
        console.log("Bookings component chart ready with data:", {
          labels: chartDates,
          data: weeklyBookingData
        });
      }
    };
    
    logChartData();
  }, [chartDates, weeklyBookingData]);

  // Chart data updated to use real data with actual dates
  const bookingsChartData = {
    labels: chartDates,
    datasets: [
      {
        label: 'Bookings',
        data: weeklyBookingData, // Use the raw data from API without local modifications
        backgroundColor: 'rgba(52, 211, 153, 0.8)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(52, 211, 153, 1)',
        minBarLength: 10, // This ensures the bars are visible even with small values
      },
    ],
  };

  // Add tooltip callback to show booking status in tooltip
  const enhancedChartOptions = {
    ...barChartOptions,
    plugins: {
      ...barChartOptions.plugins,
      tooltip: {
        ...barChartOptions.plugins?.tooltip,
        callbacks: {
          afterLabel: function(context: any) {
            // If we have status breakdown data, display it
            return `Includes all bookings (confirmed, pending, and cancelled)`;
          }
        }
      }
    }
  };

  // If there's no actual data, display a message instead of a fallback visual
  const renderEmptyDataMessage = () => {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-gray-500 text-center">
          <p className="mb-2">No booking data available for the selected period</p>
          <p className="text-sm">Bookings will appear here as they are created</p>
        </div>
      </div>
    );
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * bookingsPerPage < filteredBookings.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle booking status update with better UI feedback
  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      setIsProcessing(true);
      
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update booking');
      }

      // Get the updated booking data
      const updatedBooking = await res.json();
      
      // Update all booking collections
      const updateBookingInList = (list: Booking[]) => 
        list.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus as 'confirmed' | 'pending' | 'cancelled' } : booking
        );
      
      setAllBookings(updateBookingInList(allBookings));
      setFilteredBookings(updateBookingInList(filteredBookings));
      setDisplayedBookings(updateBookingInList(displayedBookings));
      
      // Update selected booking if open in modal
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as 'confirmed' | 'pending' | 'cancelled' });
      }
      
      // Update counts
      if (newStatus === 'confirmed') {
        setConfirmedCount(prev => prev + 1);
        if (allBookings.find(b => b.id === bookingId)?.status === 'pending') {
          setPendingCount(prev => prev - 1);
        } else if (allBookings.find(b => b.id === bookingId)?.status === 'cancelled') {
          setCancelledCount(prev => prev - 1);
        }
      } else if (newStatus === 'pending') {
        setPendingCount(prev => prev + 1);
        if (allBookings.find(b => b.id === bookingId)?.status === 'confirmed') {
          setConfirmedCount(prev => prev - 1);
        } else if (allBookings.find(b => b.id === bookingId)?.status === 'cancelled') {
          setCancelledCount(prev => prev - 1);
        }
      } else if (newStatus === 'cancelled') {
        setCancelledCount(prev => prev + 1);
        if (allBookings.find(b => b.id === bookingId)?.status === 'confirmed') {
          setConfirmedCount(prev => prev - 1);
        } else if (allBookings.find(b => b.id === bookingId)?.status === 'pending') {
          setPendingCount(prev => prev - 1);
        }
      }
      
      // Show success message
      setActionSuccess(`Booking successfully ${newStatus}`);
      setTimeout(() => setActionSuccess(''), 3000);
      
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to view booking details
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };
  
  // Function to close the modal
  const closeModal = () => {
    setIsViewModalOpen(false);
    // Wait for animation to complete before clearing data
    setTimeout(() => setSelectedBooking(null), 300);
  };
  
  // Calculate booking duration in days
  const calculateDuration = (checkIn: Date | string, checkOut: Date | string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to initiate cancel confirmation
  const confirmCancellation = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelConfirm(true);
  };
  
  // Function to execute the cancellation after confirmation
  const executeCancellation = () => {
    if (bookingToCancel) {
      handleStatusUpdate(bookingToCancel, 'cancelled');
      setShowCancelConfirm(false);
      setBookingToCancel(null);
      
      // Close the modal if it's open
      if (isViewModalOpen && selectedBooking?.id === bookingToCancel) {
        closeModal();
      }
    }
  };
  
  // Function to cancel the cancellation
  const cancelCancellation = () => {
    setShowCancelConfirm(false);
    setBookingToCancel(null);
  };

  return (
    <div className="space-y-6">
      {/* Add main loading state */}
      {loading && displayedBookings.length === 0 ? (
        <div className="p-8 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-500">Loading bookings data...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-white rounded-xl shadow-sm">
          <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
      {/* Header with stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-6">Bookings Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
              <h4 className="font-medium text-gray-900">Total Bookings</h4>
            </div>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">Confirmed</h4>
            </div>
                <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <h4 className="font-medium text-gray-900">Pending</h4>
            </div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="font-medium text-gray-900">Cancelled</h4>
            </div>
                <p className="text-2xl font-bold text-gray-900">{cancelledCount}</p>
          </div>
        </div>
        
        {/* Bookings Chart */}
        <div className="h-60 mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Last 7 Days Booking Trend</h4>
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div style={{ height: '200px', width: '100%', position: 'relative' }}>
              {chartDates.length > 0 ? (
                <>
                  {totalBookings === 0 && weeklyBookingData.every(val => val === 0) ? (
                    renderEmptyDataMessage()
                  ) : (
                    <Bar 
                      ref={chartRef}
                      data={bookingsChartData} 
                      options={enhancedChartOptions}
                    />
                  )}
                </>
              ) : renderEmptyDataMessage()}
            </div>
          )}
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
            
            {/* Table with loading states */}
        <div className="overflow-x-auto">
              {loading && displayedBookings.length > 0 ? (
                <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : null}
              
              {displayedBookings.length === 0 && !loading ? (
                <div className="p-6 text-center text-gray-500">
                  No bookings found
                  {searchQuery && (
                    <p className="mt-2 text-sm">
                      Try adjusting your search criteria
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        Clear search
                      </button>
                    </p>
                  )}
                </div>
              ) : (
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
              {displayedBookings.map((booking) => (
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
                                <span>Check-in: {formatDate(booking.checkIn)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                <span>Check-out: {formatDate(booking.checkOut)}</span>
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
                              Booked on: {formatDate(booking.createdAt)}
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
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => handleViewBooking(booking)}
                          >
                            View
                          </button>
                          <button 
                            className={`text-emerald-600 hover:text-emerald-900 mr-3 ${
                              booking.status === 'confirmed' || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                            disabled={booking.status === 'confirmed' || isProcessing}
                          >
                            {isProcessing && booking.id === bookingToCancel ? 'Processing...' : 'Confirm'}
                          </button>
                          <button 
                            className={`text-red-600 hover:text-red-900 ${
                              booking.status === 'cancelled' || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => confirmCancellation(booking.id)}
                            disabled={booking.status === 'cancelled' || isProcessing}
                          >
                            Cancel
                          </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
              )}
        </div>
            
            {/* Pagination */}
            {filteredBookings.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{displayedBookings.length}</span> of <span className="font-medium">{filteredBookings.length}</span> bookings
            </div>
            <div className="flex space-x-2">
                    <button 
                      className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                        currentPage > 1 ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={handlePreviousPage}
                      disabled={currentPage <= 1 || loading}
                    >
                Previous
              </button>
                    <button 
                      className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                        currentPage * bookingsPerPage < filteredBookings.length ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={handleNextPage}
                      disabled={currentPage * bookingsPerPage >= filteredBookings.length || loading}
                    >
                Next
              </button>
            </div>
          </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Success notification */}
      {actionSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <p>{actionSuccess}</p>
          </div>
        </div>
      )}
      
      {/* Booking View Modal */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div 
            className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full m-4 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={closeModal}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 space-y-6">
                  {/* Guest Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Guest Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-medium text-lg">
                          {selectedBooking.guestName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h5 className="text-lg font-medium text-gray-900">{selectedBooking.guestName}</h5>
                          <p className="text-gray-600">{selectedBooking.guestEmail}</p>
                          <div className="mt-2 flex items-center">
                            <Users className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-gray-600">{selectedBooking.guests} guests</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Property Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-lg font-medium text-gray-900">{selectedBooking.propertyName}</h5>
                      <p className="text-gray-600 mt-1">Property ID: {selectedBooking.propertyId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 space-y-6">
                  {/* Booking Details */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Booking Details
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            selectedBooking.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Booked on:</span>
                        <span className="ml-2 font-medium">{formatDate(selectedBooking.createdAt)}</span>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Total Amount:</span>
                        <span className="ml-2 font-medium">${selectedBooking.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Date Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Stay Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <span className="text-gray-500">Check-in:</span>
                          <span className="ml-2 font-medium">{formatDate(selectedBooking.checkIn)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <span className="text-gray-500">Check-out:</span>
                          <span className="ml-2 font-medium">{formatDate(selectedBooking.checkOut)}</span>
                        </div>
                      </div>
                      
                      <div className="font-medium text-indigo-600">
                        Duration: {calculateDuration(selectedBooking.checkIn, selectedBooking.checkOut)} days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal footer with actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <div>
                {selectedBooking.status !== 'cancelled' && (
                  <button 
                    onClick={() => confirmCancellation(selectedBooking.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                
                {selectedBooking.status !== 'confirmed' && (
                  <button 
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'confirmed');
                      closeModal();
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div 
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4 animate-fade-in p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cancel Booking</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelCancellation}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No, Keep It
              </button>
              <button 
                onClick={executeCancellation}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Booking
              </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
} 