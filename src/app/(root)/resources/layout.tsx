"use client";
import Layout from '@/components/Layout'; 
import React from 'react';

const ResourceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default ResourceLayout;
