import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Bank {
  id: string;
  name: string;
  code: string;
  country: string;
  is_active: boolean;
  processing_time_days: number;
  created_at: string;
  updated_at: string;
}

const BankManagement = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    country: 'UAE',
    is_active: true,
    processing_time_days: 7
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('name');

      if (error) throw error;
      setBanks(data || []);
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingBank) {
        const { error } = await supabase
          .from('banks')
          .update(formData)
          .eq('id', editingBank.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Bank updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('banks')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Bank created successfully",
        });
      }

      setDialogOpen(false);
      setEditingBank(null);
      setFormData({
        name: '',
        code: '',
        country: 'UAE',
        is_active: true,
        processing_time_days: 7
      });
      fetchBanks();
    } catch (error) {
      console.error('Error saving bank:', error);
      toast({
        title: "Error",
        description: "Failed to save bank",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bank: Bank) => {
    setEditingBank(bank);
    setFormData({
      name: bank.name,
      code: bank.code,
      country: bank.country,
      is_active: bank.is_active,
      processing_time_days: bank.processing_time_days
    });
    setDialogOpen(true);
  };

  const handleDelete = async (bankId: string) => {
    if (!confirm('Are you sure you want to delete this bank?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('banks')
        .delete()
        .eq('id', bankId);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Bank deleted successfully",
      });
      fetchBanks();
    } catch (error) {
      console.error('Error deleting bank:', error);
      toast({
        title: "Error",
        description: "Failed to delete bank",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBankStatus = async (bankId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banks')
        .update({ is_active: !currentStatus })
        .eq('id', bankId);

      if (error) throw error;
      fetchBanks();
      toast({
        title: "Success",
        description: `Bank ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating bank status:', error);
      toast({
        title: "Error",
        description: "Failed to update bank status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bank Management</h1>
          <p className="text-muted-foreground">Manage banks available for customer applications</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingBank(null);
              setFormData({
                name: '',
                code: '',
                country: 'UAE',
                is_active: true,
                processing_time_days: 7
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bank
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBank ? 'Edit Bank' : 'Add New Bank'}</DialogTitle>
              <DialogDescription>
                {editingBank ? 'Update bank information' : 'Add a new bank to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Bank Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Bank Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="processing_time">Processing Time (Days)</Label>
                <Input
                  id="processing_time"
                  type="number"
                  min="1"
                  value={formData.processing_time_days}
                  onChange={(e) => setFormData({ ...formData, processing_time_days: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingBank ? 'Update Bank' : 'Create Bank'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && !banks.length ? (
          <div className="col-span-full text-center py-8">Loading banks...</div>
        ) : banks.map((bank) => (
          <Card key={bank.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <CardTitle className="text-sm font-medium">{bank.name}</CardTitle>
              </div>
              <Badge variant={bank.is_active ? "default" : "secondary"}>
                {bank.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Code:</span> {bank.code}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Country:</span> {bank.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Processing Time:</span> {bank.processing_time_days} days
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(bank)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBankStatus(bank.id, bank.is_active)}
                >
                  {bank.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(bank.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && banks.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No banks found. Add your first bank to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankManagement;