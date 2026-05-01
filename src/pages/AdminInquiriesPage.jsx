import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ChevronDown, Search, Trash2, Check, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import client from '@/services/api';

const inquiriesAPI = {
  getAll: (params) => client.get('/admin/inquiries', { params }),
  getById: (id) => client.get(`/admin/inquiries/${id}`),
  create: (data) => client.post('/admin/inquiries', data),
  updateStatus: (id, status) => client.put(`/admin/inquiries/${id}/status`, { status }),
  delete: (id) => client.delete(`/admin/inquiries/${id}`),
};

export default function AdminInquiriesPage() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [newInquiry, setNewInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchInquiries = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await inquiriesAPI.getAll(params);
      setInquiries(response.data.inquiries || []);
      setPagination(response.data.pagination || { total: 0, page: 1, pages: 0, limit: 10 });
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleApplyFilters = () => {
    fetchInquiries(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', startDate: '', endDate: '' });
    setTimeout(() => fetchInquiries(1), 100);
  };

  const handleDelete = async (id) => {
    try {
      await inquiriesAPI.delete(id);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      setDeleteConfirm(null);
      toast.success('Inquiry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await inquiriesAPI.updateStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
      );
      if (selectedInquiry?._id === id) {
        setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddInquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await inquiriesAPI.create(newInquiry);
      setInquiries((prev) => [response.data.inquiry, ...prev]);
      setShowAddModal(false);
      setNewInquiry({ name: '', email: '', phone: '', subject: '', message: '' });
      toast.success('Inquiry added successfully');
    } catch (error) {
      toast.error('Failed to add inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      Resolved: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all customer inquiries</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#2E3192] hover:bg-[#1E2070] text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Inquiry
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
            <Input
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              placeholder="Name, email, subject..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((p) => ({ ...p, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Start Date</label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">End Date</label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClearFilters}>Clear</Button>
          <Button onClick={handleApplyFilters} className="bg-[#2E3192] hover:bg-[#1E2070] text-white">
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full border-4 border-[#2E3192]/20 border-t-[#2E3192] h-8 w-8"></div>
            <p className="mt-4 text-gray-500">Loading inquiries...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#eef0ff] flex items-center justify-center text-[#2E3192] font-semibold text-sm">
                          {inquiry.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{inquiry.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{inquiry.email}</TableCell>
                    <TableCell className="text-sm text-gray-500">{inquiry.phone || '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[150px] truncate">{inquiry.subject}</TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedInquiry(inquiry); setShowModal(true); }}
                          title="View"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(inquiry._id, 'Resolved')}
                          disabled={inquiry.status === 'Resolved'}
                          title="Mark Resolved"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(inquiry._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => fetchInquiries(pagination.page - 1)}
          >
            <ChevronDown className="h-4 w-4 rotate-180" />
          </Button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => fetchInquiries(pagination.page + 1)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* View Detail Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Inquiry Details</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium">{selectedInquiry.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Subject</p>
                <p className="text-sm font-medium">{selectedInquiry.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Message</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedInquiry.message}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Update Status</p>
                <div className="flex gap-2">
                  {['Pending', 'In Progress', 'Resolved'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedInquiry._id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedInquiry.status === s
                          ? 'bg-[#2E3192] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Add New Inquiry</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleAddInquiry} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Name *</label>
                  <Input
                    value={newInquiry.name}
                    onChange={(e) => setNewInquiry((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email *</label>
                  <Input
                    type="email"
                    value={newInquiry.email}
                    onChange={(e) => setNewInquiry((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
                <Input
                  value={newInquiry.phone}
                  onChange={(e) => setNewInquiry((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Subject *</label>
                <Input
                  value={newInquiry.subject}
                  onChange={(e) => setNewInquiry((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="Inquiry subject"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Message *</label>
                <textarea
                  value={newInquiry.message}
                  onChange={(e) => setNewInquiry((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Write message..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-[#2E3192] hover:bg-[#1E2070] text-white">
                  {submitting ? 'Adding...' : 'Add Inquiry'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Delete Inquiry?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}