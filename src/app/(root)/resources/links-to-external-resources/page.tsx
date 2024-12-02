"use client";

import React from 'react';
import "../resources.css";

const ExternalResources = () => {
    return (
        <div className="page-wrapper">
            <h1 className="page-title">Links to External Resources</h1>
            <ul className="resources-list">
                <li>
                    <a href="https://uaw.org" target="_blank" rel="noopener noreferrer">
                        UAW Union Resources
                    </a> - Educational resources, digital training, and labor union directories.
                </li>
                <li>
                    <a href="https://www.worker.gov" target="_blank" rel="noopener noreferrer">
                        Worker.gov
                    </a> - Learn how to address your workplace concerns and the laws that protect you.
                </li>
                <li>
                    <a href="https://www.fmcs.gov" target="_blank" rel="noopener noreferrer">
                        Federal Mediation and Conciliation Service (FMCS)
                    </a> - An independent agency whose mission is to preserve and promote labor-management peace and cooperation.
                </li>
                <li>
                    <a href="https://workcenter.gov" target="_blank" rel="noopener noreferrer">
                        Workcenter.gov
                    </a> - The Worker Organizing Resource and Knowledge (WORK) Center is a one-stop shop for information on unions and collective bargaining.
                </li>
                <li>
                    <a href="https://aflcio.org" target="_blank" rel="noopener noreferrer">
                        Aflcio.gov
                    </a> - Union member rights, digital training, and advocating for workers' rights.
                </li>
                <li>
                    <a href="https://www.nlrb.gov" target="_blank" rel="noopener noreferrer">
                        Nlrb.gov
                    </a> - Employee Rights, Employer/Union Rights and Obligations, Your Right to Discuss Wages, and more.
                </li>
            </ul>
        </div>
    );
};

export default ExternalResources;
