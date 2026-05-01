import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { blogService } from '../services/apiService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, X, Search, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminBlogsPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
    limit: 10,
  });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    featuredImage: '',
    status: 'draft',
    author: '',
    tags: '',
  });

  useEffect(() => {
    fetchBlogs(1, search);
  }, [search]);

  const fetchBlogs = async (page = 1, searchTerm = '') => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        search: searchTerm,
        status: filters.status || undefined,
      };

      const response = await blogService.getAll(params);
      const data = response.data?.data || [];
      
      // Normalize blog objects to match UI expectations
      const normalized = data.map(blog => ({
        ...blog,
        shortDescription: blog.shortDescription || 
          (blog.content ? blog.content.substring(0, 100) + '...' : ''),
      }));
      
      setBlogs(normalized);
      setPagination(response.data?.pagination || { total: 0, page: 1, pages: 0, limit: 10 });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchBlogs(1);
  };

  const handleClearFilters = () => {
    setFilters({ status: '' });
    setTimeout(() => fetchBlogs(1), 100);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this blog?')) {
      try {
        await blogService.delete(id);
        setBlogs(prev => prev.filter(b => b._id !== id));
        toast.success('Blog deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Error deleting blog');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await blogService.update(id, { status: newStatus });
      setBlogs(prev =>
        prev.map(blog => 
          blog._id === id ? { ...blog, status: newStatus } : blog
        )
      );
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

   const handleSubmit = async (e) => {
     e.preventDefault();
     setSubmitting(true);
     console.log("FORM DATA:", formData);
     try {
       // Prepare payload with proper tags format
       const payload = {
         ...formData,
         tags: formData.tags
           ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
           : [],
       };
       
       if (editing) {
         console.log("Updating blog with ID:", editing._id);
         const response = await blogService.update(editing._id, payload);
         console.log("UPDATE RESPONSE:", response);
         
         if (!response || !response.data || !response.data.data) {
           throw new Error('Invalid response format from update API');
         }
         
         const updatedBlog = {
           ...response.data.data,
           shortDescription: response.data.data.shortDescription || 
             (response.data.data.content ? response.data.data.content.substring(0, 100) + '...' : ''),
         };
         console.log("Processed updated blog:", updatedBlog);
         setBlogs(prev =>
           prev.map(blog => blog._id === editing._id ? updatedBlog : blog)
         );
         toast.success('Blog updated successfully');
       } else {
         console.log("Creating new blog");
         const response = await blogService.create(payload);
         console.log("CREATE RESPONSE:", response);
         
         if (!response || !response.data || !response.data.data) {
           throw new Error('Invalid response format from create API');
         }
         
         const newBlog = {
           ...response.data.data,
           shortDescription: response.data.data.shortDescription || 
             (response.data.data.content ? response.data.data.content.substring(0, 100) + '...' : ''),
         };
         console.log("Processed new blog:", newBlog);
         setBlogs(prev => [newBlog, ...prev]);
         toast.success('Blog created successfully');
       }
       closeForm();
     } catch (error) {
       console.error('Error saving blog:', error);
       const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Unknown error';
       toast.error(`Error saving blog: ${errorMessage}`);
     } finally {
       setSubmitting(false);
     }
   };

  const openEdit = (blog) => {
    setEditing(blog);
    // Normalize the blog data for the form
    setFormData({
      title: blog.title,
      slug: blog.slug,
      shortDescription: blog.shortDescription,
      content: blog.content,
      featuredImage: blog.featuredImage,
      status: blog.status,
      author: blog.author || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      content: '',
      featuredImage: '',
      status: 'draft',
      author: '',
      tags: '',
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage blog posts</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="bg-[#2E3192] hover:bg-[#1E2070] text-white flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Blog
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ status: value === 'all' ? '' : value })
              }
              className="w-full"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
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
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full border-4 border-[#2E3192]/20 border-t-[#2E3192] h-8 w-8"></div>
            <p className="mt-4 text-gray-500">Loading blogs...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Featured Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="flex items-center gap-3">
                      {blog.featuredImage ? (
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                          <span className="text-xs">{blog.title?.[0]?.toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{blog.title}</h3>
                        <p className="text-xs text-gray-500">{blog.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{blog.title}</TableCell>
                    <TableCell className="text-xs text-gray-500 break-all">{blog.slug}</TableCell>
                    <TableCell>{getStatusBadge(blog.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(blog)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(blog._id, blog.status === 'published' ? 'draft' : 'published')}
                        title="Toggle Status"
                      >
                        {blog.status === 'published' ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(blog._id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
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
            onClick={() => fetchBlogs(pagination.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => fetchBlogs(pagination.page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Blog' : 'Create Blog'}</h2>
              <button onClick={closeForm}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  placeholder="Slug (URL-friendly) *"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Short Description</label>
                <Textarea
                  placeholder="Brief summary of the blog"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Content</label>
                <Textarea
                  placeholder="Full blog content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Featured Image URL"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-[#2E3192] hover:bg-[#1E2070] text-white">
                  {submitting ? 'Saving...' : (editing ? 'Update Blog' : 'Create Blog')}
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
            <h3 className="text-lg font-semibold mb-2">Delete Blog?</h3>
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