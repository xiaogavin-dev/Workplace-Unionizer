import React, { useState } from 'react';
import './vertical-navbar.css';

const VerticalNavbar = () => {
    const [activePanel, setActivePanel] = useState<number | null>(null);

    const handleClick = (panel: number) => {
        setActivePanel(panel);
    };

    const closePanel = () => {
        setActivePanel(null);
    };

    return (
        <div className="main-container">
            <div className="vertical-navbar">
                <div className="navbar-items">
                    <div className="navbar-item" style={{ backgroundColor: '#f39c12' }} onClick={() => handleClick(1)}></div>
                    <div className="navbar-item" style={{ backgroundColor: '#3498db' }} onClick={() => handleClick(2)}></div>
                    <div className="navbar-item" style={{ backgroundColor: '#e74c3c' }} onClick={() => handleClick(3)}></div>
                    <div className="add-button">+</div>
                </div>
                <div className={`info-panel ${activePanel ? 'active' : ''}`}>
                    {activePanel && (
                        <div>
                            <button className="close-button" onClick={closePanel}>X</button>
                            <p>Information about panel {activePanel}</p>
                        </div>
                    )}
                </div>
                <a href="./resources"><div className="book-button">📚</div></a>

            </div>
        </div>
    );
};

export default VerticalNavbar;

