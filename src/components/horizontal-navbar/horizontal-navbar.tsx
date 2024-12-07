"use client";
import { useRouter } from 'next/navigation'; // Re-added useRouter for redirection
import { usePathname } from 'next/navigation'; // Keep using usePathname for the current path
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';
import { doSignOut } from "../../firebase/auth";
import { listenToAuthChanges } from '@/lib/redux/features/auth/authSlice';
import './horizontal-navbar.css';

interface HorizontalNavbarProps {
    pageName?: string; // Optional prop to pass pageName if needed
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ pageName }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname(); // Get the current path
    const router = useRouter(); // Added for redirection after logout

    const { isAuthenticated, isLoading, user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        dispatch(listenToAuthChanges());

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen, dispatch]);

    const handleSignOut = async () => {
        try {
            await doSignOut();
            console.log('User logged out successfully.');
            router.push('/'); // Redirect after logout
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault(); 
        router.push(isAuthenticated ? "/search" : "/"); 
    };    

    const getDynamicPageName = () => {
        if (pathname.startsWith("/joinunion")) {
            return "Join a Union";
        }
        switch (pathname) {
            case "/":
                return "";
            case "/search":
                return "Find a Union";
            case "/results":
                return "Find a Union";
            case "/createunion":
                return "Create a Union";
            case "/joinunionform":
                return "Join a Union Form";
            case "/chat":
                return "Chat"
            case "/resources":
                return "";
            case "/resources/forming-a-union":
                return "";
            case "/resources/organizing-a-strike":
                return "";
            case "/resources/knowing-your-rights":
                return "";
            case "/resources/negotiating-a-contract":
                return "";
            case "/resources/links-to-external-resources":
                return "";
            case "/resources/find-an-employment-lawyer":
                return "Find a Lawyer";
            case "/settings/basic/email":
                return "";
            case "/settings/basic/password":
                return "";
            case "/settings/basic/profile":
                return "";
            case "/settings/contact/notifications":
                return "";
            case "/settings/misc/delete-account":
                return "";
            case "/settings":
                return "Account Settings";
            default:
                return null;
        }
    }

    return (
        <div className="horizontal-navbar-container">
            <div className="navbar-left">
                <a href="/" onClick={handleLogoClick} className="navbar-logo">
                    <img
                        src="/images/Unionizer_Logo.png"
                        className="logo"
                        alt="Unionizer Logo"
                    />
                </a>
                <h1 className="page-name">{getDynamicPageName()}</h1> {/* Dynamically set the page name */}
            </div>

            {isAuthenticated && (
                <div className="navbar-item profile" onClick={toggleDropdown}>
                    <img src="/images/union-user-icon.png" className="user-btn h-12 w-12" alt="user btn" />
                    {isDropdownOpen && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                            <ul>
                                <li>
                                    <span className="block py-2 px-3 text-gray-900 rounded md:p-0 dark:text-white">
                                        {user?.displayName}
                                    </span>
                                </li>
                                <li onClick={() => {router.push('/settings/basic/profile')}}>
                                    <Link href="/settings/basic/profile">Account Settings</Link>
                                </li>
                                <hr />
                                <li onClick={handleSignOut}>
                                    <button onClick={handleSignOut} className="dropdown-logout-button">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default HorizontalNavbar;
