import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Bed, 
  Bath, 
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Type definition based on Prisma schema
type Listing = {
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
  // Add other fields if needed for display
};

// Pagination response type
type PaginatedResponse = {
  listings: Listing[];
  totalCount: number;
  totalPages: number;
}

// Editable fields for the edit modal
type EditableListingFields = {
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  typeOfPlace: string;
};

// Form status for the edit modal
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// Function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10; // Number of listings per page
  const router = useRouter();

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditableListingFields>({
    title: '',
    description: '',
    pricePerNight: 0,
    maxGuests: 0,
    bedrooms: 0,
    bathrooms: 0,
    typeOfPlace: '',
  });
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [editError, setEditError] = useState<string | null>(null);

  // Character limits for truncation
  const titleMaxLength = 30;
  const locationMaxLength = 20;

  // Fetch listings from API with pagination
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const url = searchQuery
          ? `/api/listings?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}`
          : `/api/listings?page=${currentPage}&limit=${itemsPerPage}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch listings');
        
        const data: PaginatedResponse = await response.json();
        setListings(data.listings);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [currentPage, searchQuery]);

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Refetch current page
  const fetchCurrentPage = async () => {
    setIsLoading(true);
    try {
      const url = searchQuery
        ? `/api/listings?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}`
        : `/api/listings?page=${currentPage}&limit=${itemsPerPage}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch listings');
      
      const data: PaginatedResponse = await response.json();
      setListings(data.listings);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = async (id: string) => {
    setCurrentEditId(id);
    setEditError(null);
    setFormStatus('idle');
    
    try {
      // Fetch the full listing details
      const response = await fetch(`/api/listings/${id}`);
      if (!response.ok) throw new Error('Failed to fetch listing details');
      
      const listing = await response.json();
      
      // Populate form with existing data
      setEditFormData({
        title: listing.title || '',
        description: listing.description || '',
        pricePerNight: listing.pricePerNight || 0,
        maxGuests: listing.maxGuests || 0,
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        typeOfPlace: listing.typeOfPlace || '',
      });
      
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching listing details:', error);
      alert('Failed to load listing details. Please try again.');
    }
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEditId(null);
    setEditError(null);
    setFormStatus('idle');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to numbers
    if (['pricePerNight', 'maxGuests', 'bedrooms', 'bathrooms'].includes(name)) {
      setEditFormData({
        ...editFormData,
        [name]: Number(value),
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmitEdit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!currentEditId) return;
    
    setFormStatus('submitting');
    setEditError(null);
    
    try {
      const response = await fetch(`/api/listings/${currentEditId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update listing');
      }
      
      // Update the listing in the current list
      const updatedListing = await response.json();
      setListings(listings.map(listing => 
        listing.id === currentEditId ? { ...listing, ...updatedListing } : listing
      ));
      
      // Set success status and close modal after delay
      setFormStatus('success');
      setTimeout(() => {
        handleCloseEditModal();
      }, 1500); // Close after 1.5 seconds
      
    } catch (error) {
      console.error('Error updating listing:', error);
      setEditError(error instanceof Error ? error.message : 'An unknown error occurred');
      setFormStatus('error');
    }
  };

  // Generate page numbers array for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show a subset of pages with current page in center if possible
      let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Render the form status UI
  const renderFormStatusUI = () => {
    switch (formStatus) {
      case 'submitting':
        return (
          <div className="flex justify-center items-center py-3 text-indigo-600">
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <span>Updating property...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex justify-center items-center py-3 text-green-600 bg-green-50 rounded">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Property updated successfully!</span>
          </div>
        );
      case 'error':
        return editError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {editError}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">All Properties</h3>
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
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No properties found.</p>
          </div>
        ) : (
          <>
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
                  {listings.map((listing) => (
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
                            <div className="text-sm font-medium text-gray-900" title={listing.title}>
                              {truncateText(listing.title, titleMaxLength)}
                            </div>
                            <div className="text-sm text-gray-500">ID: {truncateText(listing.id, 15)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900" title={listing.address}>
                          {truncateText(listing.address, locationMaxLength)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${listing.pricePerNight}/night</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <span className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {listing.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {listing.bathrooms}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {listing.maxGuests}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleOpenEditModal(listing.id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{listings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalCount)}
                    </span>{' '}
                    of <span className="font-medium">{totalCount}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {getPageNumbers().map(number => (
                      <button
                        key={number}
                        onClick={() => goToPage(number)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === number
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Property</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseEditModal}
                disabled={formStatus === 'submitting'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Status message */}
            {renderFormStatusUI()}
            
            <form onSubmit={handleSubmitEdit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={editFormData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                  />
                </div>
                
                <div>
                  <label htmlFor="typeOfPlace" className="block text-sm font-medium text-gray-700">Type of Place</label>
                  <select
                    id="typeOfPlace"
                    name="typeOfPlace"
                    value={editFormData.typeOfPlace}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                  >
                    <option value="">Select Type</option>
                    <option value="Entire place">Entire place</option>
                    <option value="Private room">Private room</option>
                    <option value="Hotel room">Hotel room</option>
                    <option value="Shared room">Shared room</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pricePerNight" className="block text-sm font-medium text-gray-700">Price Per Night</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="pricePerNight"
                        name="pricePerNight"
                        min="0"
                        step="0.01"
                        value={editFormData.pricePerNight}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        disabled={formStatus === 'submitting' || formStatus === 'success'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">Max Guests</label>
                    <input
                      type="number"
                      id="maxGuests"
                      name="maxGuests"
                      min="1"
                      value={editFormData.maxGuests}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      disabled={formStatus === 'submitting' || formStatus === 'success'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      min="0"
                      value={editFormData.bedrooms}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      disabled={formStatus === 'submitting' || formStatus === 'success'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      min="0"
                      step="0.5"
                      value={editFormData.bathrooms}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      disabled={formStatus === 'submitting' || formStatus === 'success'}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                  disabled={formStatus === 'submitting'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    (formStatus === 'submitting' || formStatus === 'success') ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {formStatus === 'submitting' ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 