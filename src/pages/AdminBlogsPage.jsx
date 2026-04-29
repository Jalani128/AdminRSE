import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { blogService } from '../services/apiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';

export default function AdminBlogsPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', image: null });

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = blogs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editing) {
        await blogService.update(editing._id, data);
        toast.success('Blog updated');
      } else {
        await blogService.create(data);
        toast.success('Blog created');
      }
      setFormOpen(false);
      setEditing(null);
      setFormData({ title: '', content: '', image: null });
    } catch (error) {
      toast.error('Error saving blog');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this blog?')) {
      try {
        await blogService.delete(id);
        toast.success('Blog deleted');
      } catch (error) {
        toast.error('Error deleting blog');
      }
    }
  };

  const openEdit = (blog) => {
    setEditing(blog);
    setFormData({ title: blog.title, content: blog.content, image: null });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setFormData({ title: '', content: '', image: null });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Blog Management</h1>
        <p className="text-muted-foreground">Create and manage blog posts for your real estate platform.</p>
      </div>

      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blog posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary"
          />
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">No blog posts found.</p>
          </Card>
        ) : (
          filtered.map(blog => (
            <Card key={blog._id} className="p-4 border-l-4 border-l-primary/50 hover:border-l-primary transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{blog.content}</p>
                  {blog.slug && <p className="text-xs text-gray-500 mt-2">Slug: {blog.slug}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(blog)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(blog._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy-900">{editing ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                required
                className="border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
              {editing ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
