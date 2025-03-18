import { Building, Calendar, Diamond, Mail, Home, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  logout: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  toggleSidebar,
  logout
}: SidebarProps) {
  return (
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
            <h1 className="ml-3 text-xl font-bold text-gray-900">The VillaList Admin</h1>
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

        {/* Logout */}
        <div className="px-4 py-6 border-t border-gray-200">
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
} 