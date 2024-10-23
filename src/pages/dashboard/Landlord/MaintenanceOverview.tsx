import React from 'react';
import { Card, Dropdown, ProgressBar } from 'react-bootstrap';

// This would typically come from your API
interface Maintenance{
  pendingRequests: number,
  InProgressTasks: number,
  completedTasks: number,
  averageResolutionTime: number
}

interface Dashboard {
  MaintenanceOverview:Maintenance
}

interface StatisticsProps {
  dashboard: Dashboard; // match prop name with lowercased 'dashboard'
}

const MaintenanceOverview = ({dashboard}:StatisticsProps) => {
  const maintenanceData  = dashboard?.MaintenanceOverview
  const total = maintenanceData.pendingRequests + maintenanceData.InProgressTasks + maintenanceData.completedTasks;

  return (
    <Card>
      <Card.Body>
        <Dropdown className="float-end" align="end">
          <Dropdown.Toggle as="a" className="cursor-pointer card-drop">
            <i className="mdi mdi-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Generate Report</Dropdown.Item>
            <Dropdown.Item>Export Data</Dropdown.Item>
            <Dropdown.Item>Set Priority Levels</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <h4 className="header-title mb-3">Maintenance Overview</h4>
        
        <div className="mb-4">
          <h5>Pending Requests</h5>
          <ProgressBar now={(maintenanceData.pendingRequests / total) * 100} variant="danger" label={`${maintenanceData.pendingRequests}`} />
        </div>
        
        <div className="mb-4">
          <h5>In Progress</h5>
          <ProgressBar now={(maintenanceData.InProgressTasks / total) * 100} variant="warning" label={`${maintenanceData.InProgressTasks}`} />
        </div>
        
        <div className="mb-4">
          <h5>Completed</h5>
          <ProgressBar now={(maintenanceData.completedTasks / total) * 100} variant="success" label={`${maintenanceData.completedTasks}`} />
        </div>
        
        <div className="mt-4">
          <h5>Average Resolution Time</h5>
          <p className="text-muted mb-0">
            {maintenanceData.averageResolutionTime} days
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-muted mb-0">
            Total maintenance requests: {total}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MaintenanceOverview;