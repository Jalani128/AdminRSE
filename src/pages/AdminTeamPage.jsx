import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { teamService } from '../services/apiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';

export default function AdminTeamPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', email: '' });

  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = team.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await teamService.update(editing._id, formData);
        toast.success('Team member updated');
      } else {
        await teamService.create(formData);
        toast.success('Team member created');
      }
      setFormOpen(false);
      setEditing(null);
      setFormData({ name: '', role: '', email: '' });
    } catch (error) {
      toast.error('Error saving team member');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this team member?')) {
      try {
        await teamService.delete(id);
        toast.success('Team member deleted');
      } catch (error) {
        toast.error('Error deleting team member');
      }
    }
  };

  const openEdit = (member) => {
    setEditing(member);
    setFormData(member);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setFormData({ name: '', role: '', email: '' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Team Management</h1>
        <p className="text-muted-foreground">Manage your real estate agents and staff.</p>
      </div>

      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-gray-200 focus:border-primary"
          />
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">No team members found.</p>
          </Card>
        ) : (
          filtered.map(member => (
            <Card key={member._id} className="p-4 border-l-4 border-l-primary/50 hover:border-l-primary transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-navy-900">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-sm">{member.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(member)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(member._id)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy-900">{editing ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Role</label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
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
