"use client";

import React from "react";
import Layout from "@/components/Layout";
import "./findLawyer.css";

const FindEmploymentLawyer = () => {
  return (
    <Layout>
      <div className="find-lawyer-page">
        <div className="lawyer-form">
          <div className="form-area">
            <label htmlFor="employment-issue">Employment Issue</label>
            <input id="employment-issue" type="text" placeholder="eg. Employment Contracts" />
          </div>
          <div className="form-area">
            <label htmlFor="location">City, ZIP code or County</label>
            <input id="location" type="text" placeholder="Aa" />
          </div>
          <button className="find-lawyer-button">Find a Lawyer</button>
        </div>
      </div>
    </Layout>
  );
};

export default FindEmploymentLawyer;
