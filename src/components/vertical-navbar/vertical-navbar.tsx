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
<<<<<<< HEAD
                    <a className="add-button" href="/resources/forming-a-union">+</a>
=======
                    <div className="add-button">+</div>
>>>>>>> 2d6fa44b2cbd66788de086c0ca1fd381d085dfd5
                </div>
                <div className={`info-panel ${activePanel ? 'active' : ''}`}>
                    {activePanel && (
                        <div>
                            <button className="close-button" onClick={closePanel}>X</button>
                            <p>Information about panel {activePanel}</p>
                        </div>
                    )}
                </div>
<<<<<<< HEAD
                <a href="/resources"><div className="book-button">📚</div></a>
=======
                <a href="./resources"><div className="book-button">📚</div></a>
>>>>>>> 2d6fa44b2cbd66788de086c0ca1fd381d085dfd5

            </div>
        </div>
    );
};

export default VerticalNavbar;

