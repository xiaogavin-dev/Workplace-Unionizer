import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './vertical-navbar.css';

const VerticalNavbar = ({ togglePopup, buttonRef }: { togglePopup: () => void, buttonRef: React.RefObject<HTMLDivElement> }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleBookButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 

        if (pathname.startsWith('/resources')) {
            setTimeout(() => {
                if (typeof togglePopup === 'function') {
                    togglePopup();
                }
            }, 200); 
        } else {
            router.push('/resources'); 
            setTimeout(() => {
                if (typeof togglePopup === 'function') {
                    togglePopup(); 
                }
            }, 200); 
        }

    };

    return (
        <div className="main-container">
            <div className="vertical-navbar">
                <div className="navbar-items">
                    <div className="navbar-item" style={{ backgroundColor: '#f39c12' }}></div>
                    <div className="navbar-item" style={{ backgroundColor: '#3498db' }}></div>
                    <div className="navbar-item" style={{ backgroundColor: '#e74c3c' }}></div>
                    <a href="/search"><div className="add-button">+</div></a>
                </div>

                <div className="book-button" ref={buttonRef} onClick={handleBookButtonClick} style={{ cursor: 'pointer' }}>
                    📚
                </div>
            </div>
        </div>
    );
};

export default VerticalNavbar;


