import React, { useState, useCallback, useEffect } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

// components
import PageTitle from "../../../../components/PageTitle";
import TenantsListView from "./TenantsListView";
import Profile from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { AuthActionTypes } from "../../../../redux/auth/constants";

// dummy data
import { tenants, TenantDetails, TenantDetailsManagement } from "./data";

interface Property {
  id: number;
  name: string;
}

const Tenants: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tenantManagement } = useSelector((state: RootState) => state.Auth);
  const tenantsData = tenantManagement;
  const [selectedTenant, setSelectedTenant] = useState<TenantDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    dispatch({ type: AuthActionTypes.GETTENANTLIST });

    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // Simulating an API call to fetch properties
        const response = await new Promise<Property[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: 1, name: 'Property 1' },
              { id: 2, name: 'Property 2' },
              // Add more properties as needed
            ]);
          }, 1000);
        });
        setProperties(response);
      } catch (err) {
        setError("Failed to fetch properties. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);


  const handleTenantSelect = useCallback((tenant: TenantDetails) => {
    setSelectedTenant(tenant);
  }, []);

  const handleAddTenant = useCallback(() => {
    if (properties.length === 0) {
      navigate('/apps/projects/create');
    } else {
      navigate('/apps/crm/tenants/add');
    }
  }, [properties, navigate]);

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "CRM", path: "/apps/crm/tenants" },
          { label: "Tenants", path: "/apps/crm/tenants", active: true },
        ]}
        title={"Tenant Management"}
      />

      {properties.length === 0 && (
        <Alert variant="warning">
          No properties found. Please <Alert.Link onClick={() => navigate('/apps/projects/create')}>add a property</Alert.Link> before adding tenants.
        </Alert>
      )}

{tenantsData.length > 0 && (<Row>
       <Col lg={12} xl={9}>
          <TenantsListView 
            tenantDetails={tenantsData}
            onTenantSelect={handleTenantSelect}
            properties={properties}
          />
        </Col>
        <Col lg={12} xl={3}>
          {selectedTenant ? (
            <Profile tenantDetail={selectedTenant} />
          ) : (
            <div className="alert alert-info">Select a tenant to view their profile</div>
          )}
        </Col>
      </Row>)}

      {isLoading && <div className="text-center"></div>}
    </>
  );
};

export default Tenants;