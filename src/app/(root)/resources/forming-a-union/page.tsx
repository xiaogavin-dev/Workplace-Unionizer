"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "../resources.css"; 

const FormingUnion = () => {
    const [formData, setFormData] = useState({
        name: '',
        status: '',
        location: '',
        organization: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <div className="page-wrapper">

                <div className="form-container">
                    <h1>Forming a Union</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label>Name:</label>
                            <Input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Enter name" 
                            />
                        </div>

                        <div className="form-field">
                            <label>Status:</label>
                            <Input 
                                type="text" 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange} 
                                placeholder="Enter status" 
                            />
                        </div>

                        <div className="form-field">
                            <label>Location:</label>
                            <Input 
                                type="text" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                placeholder="Enter location" 
                            />
                        </div>

                        <div className="form-field">
                            <label>Organization:</label>
                            <Input 
                                type="text" 
                                name="organization" 
                                value={formData.organization} 
                                onChange={handleChange} 
                                placeholder="Enter organization" 
                            />
                        </div>

                        <Button type="submit" className="submit-button">
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
    );
};

export default FormingUnion;
