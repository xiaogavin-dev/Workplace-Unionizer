"use client";
import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { useAppSelector } from '@/lib/redux/hooks/redux';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import "./createunion.css";
import PropagateLoader from 'react-spinners/PropagateLoader';


const CreateUnion = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [workplaces, setWorkplaces] = useState([{ workplaceName: '', organization: '', city: '', street: '', addressLine2: '', state: '', zip: '', country: '', employeeCount: 0, isUnionized: false, }]);
    const [visibility, setVisibility] = useState('public');
    const [message, setMessage] = useState('');
    const { user } = useAppSelector(state => state.auth) as { user: User | null };
    const [loading, setLoading] = useState<boolean>(false);
    const [toggle, setToggle] = useState<boolean>(false);


    const handleUnionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);
    interface Workplace {
        workplaceName: string;
        organization: string;
        city: string;
        street: string;
        addressLine2: string;
        state: string;
        zip: string;
        country: string;
        isUnionized: boolean;
        employeeCount: number;
    }
    const handleWorkplaceChange = (index: number, field: keyof Workplace, value: string | boolean | number) => {
        const updatedWorkplaces = [...workplaces];
        updatedWorkplaces[index][field] = value;
        setWorkplaces(updatedWorkplaces);
    };
    const handleAddWorkplace = () => {
        setWorkplaces([...workplaces, { workplaceName: '', organization: '', city: '', street: '', addressLine2: '', state: '', zip: '', country: '', employeeCount: 0, isUnionized: false, }]);
    };
    const handleRemoveWorkplace = (index: number) => {
        setWorkplaces(workplaces.filter((_, i) => i !== index));
    };
    const [image, setImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    // Remove the selected image
    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);


        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('visibility', visibility);
            formData.append('userId', user?.uid || '');
            formData.append('workplaces', JSON.stringify(workplaces));
            if (image) {
                formData.append('image', image);
            }


            const response = await fetch('http://localhost:5000/union/create', {
                method: 'POST',
                body: formData,
            });


            const data = await response.json();


            if (response.ok && data.data?.id) {
                setToggle(true);
                setMessage('Union successfully added to the database!');
                router.push(`/joinunionform?unionId=${data.data.id}`);

            } else {
                setMessage(`Error: ${data.message || 'Failed to create union.'}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setMessage('An error occurred while submitting the form.');
        } finally {
            setLoading(false);
        }
    };




    return (
        <Layout>
            <div className="create-union-page">
                <div className="create-union-form">
                    <form onSubmit={handleSubmit}>
                        {/* Union Name */}
                        <div className="union-header-container">
                            <div className="union-header">
                                <div className="form-group">
                                    <label><b>Union Name<span style={{ color: 'red' }}>*</span></b></label>
                                    <input type="text" value={name} onChange={handleUnionNameChange} placeholder="Union Name" required />
                                </div>
                                <div className="form-group">
                                    <label><b>Description<span style={{ color: 'red' }}>*</span></b> - Shown to users in search results</label>
                                    <textarea value={description} onChange={handleDescriptionChange} placeholder="Description of the Union" required />
                                </div>
                            </div>
                            <div className="image-upload-container">
                                <div className="image-box">
                                    {image ? (
                                        <div className="image-container">
                                            <img src={URL.createObjectURL(image)} alt="Uploaded" className="uploaded-image" />
                                            <button type="button" className="remove-image-button" onClick={removeImage}>X</button>
                                        </div>
                                    ) : (
                                        <button type="button" className="upload-button" onClick={triggerFileInput}>
                                            Upload Server Image
                                        </button>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="image-input" />
                                </div>
                                <label>250 x 250 pixels</label>
                            </div>
                        </div>
                        {/* Workplaces */}
                        <div className="workplace-container">
                            <h3><b>Workplaces</b></h3>
                            {workplaces.map((workplace, index) => (
                                <div className="workplace-section" key={index}>
                                    <div className="workplace-header">
                                        <h4>Workplace #{index + 1}<span style={{ color: 'red' }}>*</span></h4>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="remove-workplace-btn"
                                                onClick={() => handleRemoveWorkplace(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="workplace-group">
                                        <div className="workplace-input">
                                            <input
                                                type="text"
                                                placeholder="Workplace Name"
                                                value={workplace.workplaceName}
                                                onChange={(e) => handleWorkplaceChange(index, 'workplaceName', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="workplace-input">
                                            <input
                                                type="text"
                                                placeholder="Organization"
                                                value={workplace.organization}
                                                onChange={(e) => handleWorkplaceChange(index, 'organization', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="workplace-input">
                                            <input
                                                type="number"
                                                placeholder="Employee Count"
                                                value={workplace.employeeCount === 0 ? '' : workplace.employeeCount} // Display placeholder if the value is 0
                                                onChange={(e) =>
                                                    handleWorkplaceChange(
                                                        index,
                                                        'employeeCount',
                                                        e.target.value === '' ? 0 : parseInt(e.target.value, 10) // Ensure the value is a number or default to 0
                                                    )
                                                }
                                                required
                                            />
                                        </div>


                                        <div className="workplace-input">
                                            <input
                                                type="text"
                                                placeholder="Street"
                                                value={workplace.street}
                                                onChange={(e) => handleWorkplaceChange(index, 'street', e.target.value)}
                                            />
                                        </div>
                                        <div className="workplace-input">
                                            <input
                                                type="text"
                                                placeholder="Address Line 2"
                                                value={workplace.addressLine2}
                                                onChange={(e) => handleWorkplaceChange(index, 'addressLine2', e.target.value)}

                                            />
                                        </div>
                                        <div className="workplace-input">
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={workplace.city}
                                                onChange={(e) => handleWorkplaceChange(index, 'city', e.target.value)}

                                            />
                                        </div>
                                        <div className="workplace-input">
                                            <input
                                                type="text"
                                                placeholder="State"
                                                value={workplace.state}
                                                onChange={(e) => handleWorkplaceChange(index, 'state', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="workplace-input">
                                            <input
                                                type="text"
                                                placeholder="Zip Code"
                                                value={workplace.zip}
                                                onChange={(e) => handleWorkplaceChange(index, 'zip', e.target.value)}
                                            />
                                        </div>
                                        <div className="workplace-input">
                                            <input
                                                type="text"
                                                placeholder="Country"
                                                value={workplace.country}
                                                onChange={(e) => handleWorkplaceChange(index, 'country', e.target.value)}
                                            />
                                        </div>
                                        <div className="workplace-input radio-container">
                                            <p>Is already unionized?:</p>
                                            <div className="radio-buttons">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`isUnionized-${index}`}
                                                        checked={workplace.isUnionized === true}
                                                        onChange={() => handleWorkplaceChange(index, "isUnionized", true)}
                                                    />
                                                    Yes
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`isUnionized-${index}`}
                                                        checked={workplace.isUnionized === false}
                                                        onChange={() => handleWorkplaceChange(index, "isUnionized", false)}
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>




                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddWorkplace} className="add-workplace-btn">
                                Add Workplace
                            </button>
                        </div>
                        {/* Visibility */}
                        < div className="visibility-container" >
                            <label><b>Visibility & Access<span style={{ color: 'red' }}>*</span></b></label>
                            <div className="visibility-option">
                                <label>
                                    <input
                                        type="radio"
                                        id="public"
                                        name="visibility"
                                        value="public"
                                        checked={visibility === 'public'}
                                        onChange={() => setVisibility('public')}
                                    />
                                    <span className="custom-radio"></span>
                                    Public - The union appears in search results and anyone can ask to join the union
                                </label>
                            </div>
                            <div className="visibility-option">
                                <label>
                                    <input
                                        type="radio"
                                        id="private"
                                        name="visibility"
                                        value="private"
                                        checked={visibility === 'private'}
                                        onChange={() => setVisibility('private')}
                                    />
                                    <span className="custom-radio"></span>
                                    Private - The union is invite-only and does not appear in search results
                                </label>
                            </div>
                        </div>
                        {loading ? <PropagateLoader className='align-self-center' /> :
                            <button type="submit" className="submit-btn" disabled={toggle}>Submit</button>}
                        {message && <p className="message">{message}</p>}
                    </form>
                </div>
            </div>
        </Layout>
    );
};
export default CreateUnion;
