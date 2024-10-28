import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import VerticalNavbar from '@/components/vertical-navbar/vertical-navbar';
import HorizontalNavbar from '@/components/horizontal-navbar/horizontal-navbar';
import './resource-popup.css'; 

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname(); 
    const router = useRouter(); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
    const popupRef = useRef<HTMLDivElement>(null); 
    const buttonRef = useRef<HTMLDivElement>(null); 

    const togglePopup = () => {
        setIsPopupOpen((prev) => !prev); 
    };

    const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);

    const toggleDropdown = (dropdownIndex: number) => {
        setOpenDropdowns((prev) =>
            prev.includes(dropdownIndex)
                ? prev.filter((index) => index !== dropdownIndex) 
                : [...prev, dropdownIndex] 
        );
    };

    const getDynamicPageName = () => {
        switch (pathname) {
            case "/":
                return "Home";
            case "/search":
                return "Find a Union";
            case "/resources":
                return "Resource Guide";
            case "/resources/forming-a-union":
                return "Forming a Union";
            case "/resources/organizing-a-strike":
                return "Organizing a Strike";
            case "/resources/knowing-your-rights":
                return "Knowing Your Rights";
            case "/resources/negotiating-a-contract":
                return "Negotiating a Contract";
            default:
                return "Unionizer"; 
        }
    };

    useEffect(() => {
        if (pathname === '/resources') {
            setIsPopupOpen(true); 
        }
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current && !popupRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)
            ) {
                setIsPopupOpen(false);
            }
        };

        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);
    const navigateToPage = (url: string, dropdownIndex: number) => {
        router.push(url); 
        toggleDropdown(dropdownIndex); 
    };

    return (
        <div className="page-wrapper">
            <div className="horizontal-navbar-container">
                <HorizontalNavbar pageName={getDynamicPageName()} />
            </div>

            <div className="content-container">
                <div className="vertical-navbar-container">
                    <VerticalNavbar togglePopup={togglePopup} buttonRef={buttonRef} />
                </div>

                <div className="page-content">
                    {children}
                </div>
            </div>

            {/* Resource Guide Pop-up */}
            {isPopupOpen && (
                <div className="resource-popup" ref={popupRef} onClick={(e) => e.stopPropagation()}>
                    <h1 className="popup-title">Resource Guide</h1>
                    <hr />
                    <br />
                    <ul className="resource-list">
                        {/* Resource 1 Dropdown */}
                        <li
                            onClick={() => navigateToPage('/resources', 1)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className={`resources-title ${openDropdowns.includes(1) ? 'active' : ''}`}
                        >
                            <span className={`arrow ${openDropdowns.includes(1) ? 'down' : ''}`} />
                            Resources 1
                        </li>
                        {openDropdowns.includes(1) && (
                            <ul className="nested-resources">
                                <li onClick={() => router.push('/resources/forming-a-union')}># Forming a Union</li>
                                <li onClick={() => router.push('/resources/knowing-your-rights')}># Knowing Your Rights</li>
                            </ul>
                        )}

                        {/* Resource 2 Dropdown */}
                        <li
                            onClick={() => navigateToPage('/resources', 2)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className={`resources-title ${openDropdowns.includes(2) ? 'active' : ''}`}
                        >
                            <span className={`arrow ${openDropdowns.includes(2) ? 'down' : ''}`} />
                            Resources 2
                        </li>
                        {openDropdowns.includes(2) && (
                            <ul className="nested-resources">
                                <li onClick={() => router.push('/resources/organizing-a-strike')}># Organizing a Strike</li>
                                <li onClick={() => router.push('/resources/negotiating-a-contract')}># Negotiating a Contract</li>
                            </ul>
                        )}

                        {/* Resource 3 Dropdown */}
                        <li
                            onClick={() => navigateToPage('/resources', 3)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className={`resources-title ${openDropdowns.includes(3) ? 'active' : ''}`}
                        >
                            <span className={`arrow ${openDropdowns.includes(3) ? 'down' : ''}`} />
                            Resources 3
                        </li>
                        {openDropdowns.includes(3) && (
                            <ul className="nested-resources">
                                <li># Additional Resource 1</li>
                                <li># Additional Resource 2</li>
                            </ul>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Layout;
