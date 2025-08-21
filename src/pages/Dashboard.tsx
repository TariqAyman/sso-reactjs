import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const QuickActions = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  &:hover {
    background: #2980b9;
  }
`;

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardContainer>
      <WelcomeCard>
        <h1>Welcome to SSO Management Dashboard</h1>
        <p>
          Hello {user?.firstName || user?.email}! This is your Single Sign-On management 
          dashboard where you can manage tenants, monitor authentication, and configure 
          SAML settings.
        </p>
      </WelcomeCard>

      <StatsGrid>
        <StatCard>
          <StatNumber>3</StatNumber>
          <StatLabel>Active Tenants</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>127</StatNumber>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>45</StatNumber>
          <StatLabel>SSO Logins Today</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>99.8%</StatNumber>
          <StatLabel>System Uptime</StatLabel>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        <h2>Quick Actions</h2>
        <ActionButton onClick={() => window.location.href = '/tenants'}>
          Manage Tenants
        </ActionButton>
        <ActionButton onClick={() => alert('Feature coming soon!')}>
          View Audit Logs
        </ActionButton>
        <ActionButton onClick={() => alert('Feature coming soon!')}>
          System Settings
        </ActionButton>
        <ActionButton onClick={() => alert('Feature coming soon!')}>
          Generate Reports
        </ActionButton>
      </QuickActions>
    </DashboardContainer>
  );
};
