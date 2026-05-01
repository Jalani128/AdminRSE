import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Sabhi possible social links ko initialize karein taaki input crash na ho
  const defaultForm = {
    name: '',
    role: '',
    email: '',
    phone: '',
    image: '',
    bio: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: '',
      website: '',
    },
    isActive: true,
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchTeam();
  }, []);

   const fetchTeam = async () => {
     setIsLoading(true);
     try {
       const response = await teamService.getAll();
       // Fix: API returns { success: true, data: [...] }
       const data = response.data?.data || [];
       // Normalize member objects to match UI expectations
       const normalized = data.map(member => ({
         ...member,
         role: member.designation,
         image: member.profileImage,
       }));
       setTeam(normalized);
     } catch (error) {
       console.error('Error fetching team:', error);
       toast.error('Failed to load team members');
     } finally {
       setIsLoading(false);
     }
   };

  const filtered = team.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.role?.toLowerCase().includes(search.toLowerCase())
  );

   const handleSubmit = async (e) => {
     e.preventDefault();
     setSubmitting(true);
     try {
       if (editing) {
         const response = await teamService.update(editing._id, formData);
         // Normalize the updated member data
         const updatedMember = {
           ...response.data.data,
           role: response.data.data.designation,
           image: response.data.data.profileImage,
         };
         setTeam((prev) =>
           prev.map((m) => (m._id === editing._id ? updatedMember : m))
         );
         toast.success('Updated successfully');
       } else {
         const response = await teamService.create(formData);
         // Normalize the new member data
         const newMember = {
           ...response.data.data,
           role: response.data.data.designation,
           image: response.data.data.profileImage,
         };
         setTeam((prev) => [newMember, ...prev]);
         toast.success('Added successfully');
       }
       closeForm();
     } catch (error) {
       toast.error('Error saving data');
     } finally {
       setSubmitting(false);
     }
   };

  const handleDelete = async (id) => {
    try {
      await teamService.delete(id);
      setTeam((prev) => prev.filter((m) => m._id !== id));
      setDeleteConfirm(null);
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openEdit = (member) => {
    setEditing(member);
    // Yahan hum ensure kar rahe hain ki agar socialLinks missing hain toh empty strings milen
    setFormData({
      ...defaultForm,
      ...member,
      socialLinks: {
        ...defaultForm.socialLinks,
        ...(member.socialLinks || {}),
      },
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setFormData(defaultForm);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your real estate agents</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="bg-[#2E3192] text-white">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Team Member
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 animate-pulse text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <Card key={member._id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  {member.image ? (
                    <img src={member.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold">
                      {member.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold truncate">{member.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{member.role}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(member)}>
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200" onClick={() => setDeleteConfirm(member._id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Member' : 'Add Member'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <Input placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <Input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <textarea 
              className="w-full p-2 border rounded-md text-sm min-h-[80px]" 
              placeholder="Bio" 
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})} 
            />

            <div className="grid grid-cols-2 gap-3">
              {Object.keys(defaultForm.socialLinks).map((platform) => (
                <Input
                  key={platform}
                  placeholder={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  value={formData.socialLinks?.[platform] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, [platform]: e.target.value }
                  })}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
              <label className="text-sm">Active Member</label>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-[#2E3192] text-white">
              {submitting ? 'Processing...' : 'Save Member'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Overlay */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-lg font-bold">Confirm Delete</h3>
            <p className="text-gray-500 text-sm mt-2">Are you sure you want to remove this member?</p>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button className="bg-red-500 text-white flex-1" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}