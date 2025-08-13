import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Building2, Check, X, UserCog, Edit, Trash2 } from 'lucide-react';

const PartnerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  // Mock data - replace with actual data from Supabase
  const partners = [
    {
      id: '1',
      name: 'ABC Consulting',
      email: 'contact@abcconsulting.com',
      company_name: 'ABC Business Consultants LLC',
      partner_level: 'Gold',
      status: 'pending',
      assigned_manager: null,
      total_clients: 0,
      success_rate: 0,
      created_at: '2024-01-12T11:00:00Z'
    },
    {
      id: '2',
      name: 'XYZ Services',
      email: 'info@xyzservices.com',
      company_name: 'XYZ Business Services FZE',
      partner_level: 'Silver',
      status: 'approved',
      assigned_manager: 'Michael Johnson',
      total_clients: 15,
      success_rate: 85,
      created_at: '2024-01-08T16:30:00Z'
    }
  ];

  const managers = [
    { id: '1', name: 'Michael Johnson' },
    { id: '2', name: 'Sarah Wilson' }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      pending: 'outline',
      approved: 'default',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const colors: { [key: string]: string } = {
      Bronze: 'bg-amber-100 text-amber-800',
      Silver: 'bg-gray-100 text-gray-800',
      Gold: 'bg-yellow-100 text-yellow-800',
      Platinum: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Partner Management</h1>
          <p className="text-muted-foreground">Approve partner registrations and assign to managers</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Partners
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              Pending Approval
            </Button>
            <Button 
              variant={filter === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilter('approved')}
            >
              Approved
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Manager</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-sm text-muted-foreground">{partner.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{partner.company_name}</TableCell>
                    <TableCell>{getLevelBadge(partner.partner_level)}</TableCell>
                    <TableCell>{getStatusBadge(partner.status)}</TableCell>
                    <TableCell>
                      {partner.assigned_manager ? (
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4" />
                          {partner.assigned_manager}
                        </div>
                      ) : (
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Assign Manager" />
                          </SelectTrigger>
                          <SelectContent>
                            {managers.map((manager) => (
                              <SelectItem key={manager.id} value={manager.id}>
                                {manager.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>{partner.total_clients}</TableCell>
                    <TableCell>{partner.success_rate}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {partner.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Bronze</span>
                  <span className="text-sm text-muted-foreground">0-10 clients</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Silver</span>
                  <span className="text-sm text-muted-foreground">11-25 clients</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Gold</span>
                  <span className="text-sm text-muted-foreground">26-50 clients</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Platinum</span>
                  <span className="text-sm text-muted-foreground">50+ clients</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commission Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Bronze</span>
                  <span className="text-sm text-muted-foreground">3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Silver</span>
                  <span className="text-sm text-muted-foreground">5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Gold</span>
                  <span className="text-sm text-muted-foreground">7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Platinum</span>
                  <span className="text-sm text-muted-foreground">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Total Partners</span>
                  <span className="font-medium">{partners.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Approval</span>
                  <span className="font-medium">{partners.filter(p => p.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Partners</span>
                  <span className="font-medium">{partners.filter(p => p.status === 'approved').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Unassigned</span>
                  <span className="font-medium">{partners.filter(p => !p.assigned_manager).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerManagement;