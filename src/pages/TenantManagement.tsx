import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #2980b9;
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const Modal = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background: white;
  margin: 5% auto;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  &:hover {
    background: #5a6268;
  }
`;

interface Tenant {
  id: number;
  uuid: string;
  key: string;
  entityId: string;
  loginUrl: string;
  logoutUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    entityId: '',
    loginUrl: '',
    logoutUrl: '',
    x509cert: '',
    metadata: '{}',
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get('/tenants');
      setTenants(response.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = () => {
    setEditingTenant(null);
    setFormData({
      key: '',
      entityId: '',
      loginUrl: '',
      logoutUrl: '',
      x509cert: '',
      metadata: '{}',
    });
    setShowModal(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      key: tenant.key,
      entityId: tenant.entityId,
      loginUrl: tenant.loginUrl,
      logoutUrl: tenant.logoutUrl || '',
      x509cert: '',
      metadata: '{}',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTenant) {
        await axios.patch(`/tenants/${editingTenant.id}`, formData);
      } else {
        await axios.post('/tenants', formData);
      }
      setShowModal(false);
      fetchTenants();
    } catch (error) {
      console.error('Error saving tenant:', error);
      alert('Error saving tenant. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await axios.delete(`/tenants/${id}`);
        fetchTenants();
      } catch (error) {
        console.error('Error deleting tenant:', error);
        alert('Error deleting tenant. Please try again.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <h1>Tenant Management</h1>
        <Button onClick={handleCreateTenant}>Create New Tenant</Button>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>Key</Th>
            <Th>Entity ID</Th>
            <Th>Login URL</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <Td>{tenant.key}</Td>
              <Td>{tenant.entityId}</Td>
              <Td>{tenant.loginUrl}</Td>
              <Td>{tenant.isActive ? 'Active' : 'Inactive'}</Td>
              <Td>
                <Button onClick={() => handleEditTenant(tenant)}>Edit</Button>
                <Button 
                  onClick={() => handleDelete(tenant.id)}
                  style={{ marginLeft: '0.5rem', background: '#e74c3c' }}
                >
                  Delete
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal}>
        <ModalContent>
          <h2>{editingTenant ? 'Edit Tenant' : 'Create New Tenant'}</h2>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Key</Label>
              <Input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Entity ID</Label>
              <Input
                type="text"
                value={formData.entityId}
                onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Login URL</Label>
              <Input
                type="url"
                value={formData.loginUrl}
                onChange={(e) => setFormData({ ...formData, loginUrl: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Logout URL (Optional)</Label>
              <Input
                type="url"
                value={formData.logoutUrl}
                onChange={(e) => setFormData({ ...formData, logoutUrl: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>x509 Certificate</Label>
              <TextArea
                value={formData.x509cert}
                onChange={(e) => setFormData({ ...formData, x509cert: e.target.value })}
                placeholder="Paste the x509 certificate here..."
                required
              />
            </FormGroup>

            <ButtonGroup>
              <CancelButton type="button" onClick={() => setShowModal(false)}>
                Cancel
              </CancelButton>
              <Button type="submit">
                {editingTenant ? 'Update' : 'Create'} Tenant
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};
