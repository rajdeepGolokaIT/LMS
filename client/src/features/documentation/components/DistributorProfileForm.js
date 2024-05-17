import TitleCard from "../../../components/Cards/TitleCard";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import axios from 'axios';
import { BASE_URL } from "../../../Endpoint";

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
    const [gstNo, setGstNo] = useState('');
    const [panNo, setPanNo] = useState('');
    const [salespersonList, setSalespersonList] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const dispatch = useDispatch();

    const fetchDistributors = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/salespersons/salespersonlist-names-ids?size=1000`);
            const persons = response.data.map(([id, name]) => ({ id, name }));
            console.log(persons);
            setSalespersonList(persons);
        } catch (error) {
            console.error('Error fetching distributors:', error);
        }
    };

    useEffect(() => {
        fetchDistributors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            address,
            zone,
            city,
            region,
            state,
            agencyName,
            contactPerson,
            contactNumber,
            email,
            gstNo,
            panNo
        }

        console.log(formData);

        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/distributorProfiles/add-distributorProfile?salespersonId=${selectedPerson}`,
                formData,
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
            setGstNo('');
            setPanNo('');
            setSelectedPerson(null);
        } catch (error) {
            console.error('Error creating distributor profile:', error);
            // Handle error, show error message to the user, etc.
            dispatch(showNotification({ message: 'Distributor profile creation failed! 😵', status: 0 }));
        }
    };

    console.log(selectedPerson);

    return (
        <>
            <TitleCard title="Create Distributor Profile" topMargin="mt-2">
                <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg ">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        <div>
                            <label className="label label-text text-base">Salesperson Name:</label>
                            <select
                                className="w-full select select-primary"
                                onClick={(e) => setSelectedPerson(e.target.value)}
                            >
                                <option value="">Select Salesperson</option>
                                {salespersonList.map((salesperson) => (
                                    <option key={salesperson.id} value={salesperson.id}>
                                        {salesperson.name}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        <div>
                            <label htmlFor="zone" className="label label-text text-base">Zone:</label>
                            <input
                                type="text"
                                pattern="[A-Za-z]+"
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
                                pattern="[A-Za-z]+"
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
                                pattern="[A-Za-z]+"
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
                                pattern="[A-Za-z\s]+"
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
                                pattern="^[a-zA-Z\s]*$"
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
                                pattern="[A-Za-z\s]+"
                                
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
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit phone number"
                                placeholder="Please enter a 10-digit phone number"
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
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                placeholder="Email"
                                className="w-full input input-bordered input-primary"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="gstNo" className="label label-text text-base">GST Number:</label>
                            <input
                                type="text"
                                pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}"
                                placeholder="Enter a valid GST Number [Eg. 22AAAAA0000A1Z5]"
                                className="w-full input input-bordered input-primary"
                                id="gstNo"
                                value={gstNo}
                                onChange={(e) => setGstNo(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="panNo" className="label label-text text-base">PAN Number:</label>
                            <input
                                type="text"
                                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                                placeholder="Enter a valid PAN Number [Eg. AAAAA1234A]"
                                className="w-full input input-bordered input-primary"
                                id="panNo"
                                value={panNo}
                                onChange={(e) => setPanNo(e.target.value)}
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
