import TitleCard from "../../../components/Cards/TitleCard";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import axios from 'axios';

function DistributorProfileForm() {

    const [address, setAddress] = useState('');
    const [zone, setZone] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [state, setState] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributorProfiles/add-distributorProfile',
                {
                    address,
                    zone,
                    city,
                    region,
                    state,
                    agencyName,
                    contactPerson,
                    contactNumber,
                    email
                }
            );
            console.log('Distributor profile created:', response.data);
            // Optionally, you can reset the form fields after successful submission
            dispatch(showNotification({ message: 'Distributor profile created successfully 😁', status: 1 }));
            setAddress('');
            setZone('');
            setCity('');
            setRegion('');
            setState('');
            setAgencyName('');
            setContactPerson('');
            setContactNumber('');
            setEmail('');
        } catch (error) {
            console.error('Error creating distributor profile:', error);
            // Handle error, show error message to the user, etc.
            dispatch(showNotification({ message: 'Distributor profile creation failed! 😵', status: 0 }));
        }
    };

    return (
        <>
            <TitleCard title="Create Distributor Profile" topMargin="mt-2">
                <div className="w-full p-6 m-auto bg-white rounded-lg shadow-lg ">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="address" className="label label-text text-base">Address:</label>
                            <input
                                type="text"
                                placeholder="Address"
                                className="w-full input input-bordered input-primary"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="zone" className="label label-text text-base">Zone:</label>
                            <input
                                type="text"
                                placeholder="Zone"
                                className="w-full input input-bordered input-primary"
                                id="zone"
                                value={zone}
                                onChange={(e) => setZone(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="label label-text text-base">City:</label>
                            <input
                                type="text"
                                placeholder="City"
                                className="w-full input input-bordered input-primary"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="region" className="label label-text text-base">Region:</label>
                            <input
                                type="text"
                                placeholder="Region"
                                className="w-full input input-bordered input-primary"
                                id="region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="label label-text text-base">State:</label>
                            <input
                                type="text"
                                placeholder="State"
                                className="w-full input input-bordered input-primary"
                                id="state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="agencyName" className="label label-text text-base">Agency Name:</label>
                            <input
                                type="text"
                                placeholder="Agency Name"
                                className="w-full input input-bordered input-primary"
                                id="agencyName"
                                value={agencyName}
                                onChange={(e) => setAgencyName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contactPerson" className="label label-text text-base">Contact Person:</label>
                            <input
                                type="text"
                                placeholder="Contact Person"
                                className="w-full input input-bordered input-primary"
                                id="contactPerson"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contactNumber" className="label label-text text-base">Contact Number:</label>
                            <input
                                type="phone"
                                placeholder="Contact Number"
                                className="w-full input input-bordered input-primary"
                                id="contactNumber"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="label label-text text-base">Email:</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full input input-bordered input-primary"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        </div>
                        {/* Add other fields here as needed */}
                        {/* Repeat similar code for other fields */}
                        <button type="submit" className="btn btn-primary">Create Profile</button>
                    </form>
                </div>
            </TitleCard>
        </>
    );
}

export default DistributorProfileForm;
