import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Alert } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "../../../../components";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/store";
import { AuthActionTypes } from "../../../../redux/auth/constants";
import { AppDispatch } from "../../../../redux/store";
import { createNewTenant } from "../../../../redux/actions";
import { useForm, Controller } from "react-hook-form";
import Spinner from "../../../../components/Spinner";
import TopDisplay from "../../../../layouts/TopDisplay";
import { APICore } from "../../../../helpers/api/apiCore";

interface Property {
  _id: string;
  name: string;
}

interface TenantFormData {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  idPassportNumber: string;
  unitNumber: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentAmount: number;
  securityDeposit: number;
  occupants: number;
  pets: boolean;
}

const phoneRegExp =/^\+([1-9]{1,3})[0-9]{6,12}$/;

const schema = yup.object().shape({
  propertyId: yup.string().required("Please select a property"),
  name: yup.string().required("Please enter name"),
  email: yup.string().required("Please enter email").email("Please enter valid email"),
  phone: yup.string().required("Please enter phone").matches(phoneRegExp, "Phone number is not valid"),
  idPassportNumber: yup.string().required("Please enter ID or Passport number"),
  unitNumber: yup.string().required("Please enter unit number"),
  leaseStartDate: yup.date().required("Please enter lease start date"),
  leaseEndDate: yup.date()
    .required("Please enter lease end date")
    .min(yup.ref('leaseStartDate'), "End date can't be before start date"),
  rentAmount: yup.number()
    .required("Please enter rent amount")
    .positive("Rent amount must be positive"),
  securityDeposit: yup.number()
    .required("Please enter security deposit")
    .positive("Security deposit must be positive"),
  occupants: yup.number()
    .required("Please enter number of occupants")
    .positive("Number of occupants must be positive")
    .integer("Number of occupants must be an integer"),
  pets: yup.boolean().required("Please specify if pets are allowed"),
});

const AddTenantPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const api = new APICore()
  const { tenantLoading, loading, error } = useSelector((state: RootState) => state.Auth);
  const [propertiesList, setpropertiesList] = useState([])
  const Get = async()=>{
    try{
      const {data} = await api.get('/api/getPropertyname',{limit:1000})
      if(data.result)
      {
        setpropertiesList(data.data)
      }
    }
    catch(error)
    {
      console.log(error)
    }
  }
  useEffect(() => {
    Get()
  }, []);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<TenantFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      propertyId: "",
      name: "",
      email: "",
      phone: "",
      idPassportNumber: "",
      unitNumber: "",
      leaseStartDate: "",
      leaseEndDate: "",
      rentAmount: 0,
      securityDeposit: 0,
      occupants: 1,
      pets: false,
    }
  });

  // Log form values as they change
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => 
      console.log(`Field ${name} changed to ${value} (type: ${type})`));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: TenantFormData) => {
    dispatch(createNewTenant(data['propertyId'], data['name'], data['email'],data['phone'], data['idPassportNumber'], data['unitNumber'], data['leaseStartDate'], data['leaseEndDate'], data['rentAmount'], data['securityDeposit'], data['occupants'],data['pets']))

    
  };

  if (loading) {
    return <Alert variant="info">Loading...</Alert>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!propertiesList || propertiesList.length === 0) {
    return (
      <Alert variant="warning">
        No properties available. Please <Alert.Link href="/apps/projects/create">add a property</Alert.Link> first.
      </Alert>
    );
  }

  return (
    <Card>
      <TopDisplay/>
      <Card.Body>
        <Card.Title>Add New Tenant</Card.Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Controller
                name="propertyId"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Property"
                    type="select"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  >
                    <option value="">Select a property</option>
                    {propertiesList.map((property: Property) => (
                      <option key={property._id} value={property._id}>
                        {property.name}
                      </option>
                    ))}
                  </FormInput>
                )}
              />
            </Col>
            <Col md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Name"
                    type="text"
                    placeholder="Enter tenant's full name"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Email"
                    type="email"
                    placeholder="Enter email address"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
            <Col md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Phone"
                    type="tel"
                    placeholder="Enter phone number"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Controller
                name="idPassportNumber"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="ID/Passport Number"
                    type="text"
                    placeholder="Enter ID or Passport number"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
            <Col md={6}>
              <Controller
                name="unitNumber"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Unit Number"
                    type="text"
                    placeholder="Enter unit number"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Controller
                name="leaseStartDate"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Lease Start Date"
                    type="date"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
            <Col md={6}>
              <Controller
                name="leaseEndDate"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Lease End Date"
                    type="date"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Controller
                name="rentAmount"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Rent Amount"
                    type="number"
                    placeholder="Enter monthly rent amount"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
            <Col md={6}>
              <Controller
                name="securityDeposit"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Security Deposit"
                    type="number"
                    placeholder="Enter security deposit amount"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Controller
                name="occupants"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Number of Occupants"
                    type="number"
                    placeholder="Enter number of occupants"
                    containerClass={"mb-3"}
                    {...field}
                    errors={errors}
                  />
                )}
              />
            </Col>
            <Col md={6}>
              <Controller
                name="pets"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormInput
                    label="Pets Allowed"
                    type="checkbox"
                    containerClass={"mb-3"}
                    {...field}
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    errors={errors}
                  />
                )}
              />
            </Col>
          </Row>
          <div className="text-end">
          <Button variant="success"  type="submit" className="waves-effect waves-light me-1" disabled={tenantLoading}>
                    {(tenantLoading)&&<Spinner
                  className="spinner-grow-sm me-2"
                  tag="span"
                  color="white"
                  type="grow"
                />}
                      <span>Add Tenant</span>
                    </Button>
            <Button variant="danger" className="waves-effect waves-light " onClick={() => navigate('/apps/crm/tenants')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default AddTenantPage;