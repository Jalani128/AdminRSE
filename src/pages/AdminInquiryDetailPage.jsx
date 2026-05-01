import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster, toast } from 'sonner';
import { X, Edit } from 'lucide-react';
import { inquiriesAPI } from '@/services/api';

export default function InquiryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchInquiry = async () => {
    setLoading(true);

    try {
      const response = await inquiriesAPI.getById(id);
      const data = response.data.inquiry || response.data;

      setInquiry(data);
      setStatus(data.status || 'Pending');
    } catch (error) {
      console.error('Error fetching inquiry:', error);
      toast.error('Failed to load inquiry');
      navigate('/admin/inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!status || !inquiry) return;

    setUpdating(true);

    try {
      await inquiriesAPI.updateStatus(id, { status });

      setInquiry((prev) => ({
        ...prev,
        status,
      }));

      toast.success('Inquiry status updated successfully');
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast.error('Failed to update inquiry status');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchInquiry();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full border-4 border-primary/20 border-t-primary h-8 w-8"></div>
        <p className="mt-4 text-muted-foreground">
          Loading inquiry details...
        </p>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Inquiry not found</p>

        <Button
          onClick={() => navigate('/admin/inquiries')}
          variant="outline"
          className="mt-4"
        >
          Back to Inquiries
        </Button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-navy-900">
            Inquiry Details
          </h1>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/inquiries')}
            >
              <X className="mr-2 h-4 w-4" />
              Back to List
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/admin/inquiries/${id}/edit`)}
              disabled={updating}
            >
              Edit
              <Edit className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-2">
                Inquiry Information
              </h2>

              <p className="text-muted-foreground">
                Inquiry submitted on{' '}
                <span className="font-medium">
                  {inquiry.createdAt
                    ? `${new Date(inquiry.createdAt).toLocaleDateString()} at ${new Date(
                        inquiry.createdAt
                      ).toLocaleTimeString()}`
                    : 'Unknown date'}
                </span>
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Name
                </h3>
                <p className="text-navy-900">{inquiry.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Email
                </h3>
                <p className="text-navy-900">{inquiry.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Phone
                </h3>
                <p className="text-navy-900">
                  {inquiry.phone || 'Not provided'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Subject
                </h3>
                <p className="text-navy-900">{inquiry.subject}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Message
              </h3>
              <p className="text-navy-900 whitespace-pre-line">
                {inquiry.message}
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Status
              </h3>

              <Select
                value={status}
                onValueChange={setStatus}
                disabled={updating}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="default"
                size="sm"
                className="mt-3"
                onClick={handleStatusChange}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}