"use client";
import React from 'react';
import VerticalNavbar from '../../../components/vertical-navbar/vertical-navbar';
import HorizontalNavbar from '../../../components/horizontal-navbar/horizontal-navbar';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'; 
import "./resources.css"; 

const ResourcePage = () => {
    const router = useRouter();

    const resources = [
      { id: 1, name: "Forming a Union", link: "/resources/forming-a-union" },
      { id: 2, name: "Organizing a Strike", link: "/resources/organizing-a-strike" },
      { id: 3, name: "Negotiating a Contract", link: "/resources/negotiating-a-contract" },
      { id: 4, name: "Privacy for Workers in Unions", link: "/resources/privacy-workers" },
      { id: 5, name: "Legal Aid", link: "/resources/legal-aid" },
    ];
  
    return (
      <div className="page-wrapper">
        <div className="horizontal-navbar-container">
          <HorizontalNavbar pageName="Resource Guide" />
        </div>
  
        <div className="content-container">
          <div className="vertical-navbar-container">
            <VerticalNavbar />
          </div>
  
          <div className="resource-list-container">
            {resources.map(resource => (
              <Button 
                key={resource.id} 
                className="resource-button"
                onClick={() => router.push(resource.link)}
              >
                {resource.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ResourcePage;
