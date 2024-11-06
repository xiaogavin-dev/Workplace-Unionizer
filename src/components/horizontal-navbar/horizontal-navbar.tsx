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

    // Function to dynamically determine the page name based on the current path
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
            case "/settings":
                return "Account Settings";
            // Add more cases for other routes as needed
            default:
                return pageName || "Unionizer"; // Default page name or passed prop
        }
    };

    return (
        <div className="horizontal-navbar-container">
            <div className="navbar-left">
                <a href="/" className="navbar-logo">
                    <img src="/images/Unionizer_Logo.png" className="logo" alt="Flowbite Logo" />
                </a>
                <h1 className="page-name">{getDynamicPageName()}</h1> {/* Dynamically set the page name */}
            </div>

            <div className="navbar-item profile" onClick={toggleDropdown}>
                <img src="/images/user.png" className="user-btn" alt="user btn" />
                {isDropdownOpen && (
                    <div className="dropdown-menu" ref={dropdownRef}>
                        <ul>
                            <li>
                                <span className="block py-2 px-3 text-gray-900 rounded md:p-0 dark:text-white">
                                    {user?.displayName}
                                </span>
                            </li>
                            <li>
                                <Link href="/profile">Profile</Link>
                            </li>
                            <li>
                                <Link href="/settings">Settings & Privacy</Link>
                            </li>
                            <li>
                                <Link href="/help">Help</Link>
                            </li>
                            <hr />
                            <li>
                                <button onClick={handleSignOut} className="dropdown-logout-button">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HorizontalNavbar;
