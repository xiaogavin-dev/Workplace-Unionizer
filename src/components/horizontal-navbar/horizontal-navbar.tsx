"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';
import { doSignOut } from "../../firebase/auth";
import { listenToAuthChanges } from '@/lib/redux/features/auth/authSlice';
import './horizontal-navbar.css';

interface HorizontalNavbarProps {
    pageName?: string;
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ pageName }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const { isAuthenticated, isLoading, user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        dispatch(listenToAuthChanges());
    }, [dispatch]);


<<<<<<< HEAD
    const handleSignOut = () => {
        doSignOut().then(() => {
            // You can add any additional actions or state updates here, if needed
            console.log('User logged out successfully.');
            router.push('/');
        }).catch(error => {
            console.error('Error signing out:', error);
        });
=======
    const handleSignOut = async () => {
        try {
            await doSignOut();
            console.log('User logged out successfully.');
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
>>>>>>> 2d6fa44b2cbd66788de086c0ca1fd381d085dfd5
    };

    return (
        <div className="horizontal-navbar-container">
            <div className="navbar-left">
<<<<<<< HEAD
                <a href="/search" className="navbar-logo">
=======
                <a href="/" className="navbar-logo">
>>>>>>> 2d6fa44b2cbd66788de086c0ca1fd381d085dfd5
                    <img src="https://flowbite.com/docs/images/logo.svg" className="logo" alt="Flowbite Logo" />
                    <span className="name">Unionizer</span>
                </a>

                {pageName && <h1 className="page-name">{pageName}</h1>}
            </div>

            <div className="navbar-item profile" onClick={toggleDropdown}>
                <img src="/images/user.png" className="user-btn" alt="user btn" />
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <ul>
                            <li>
<<<<<<< HEAD
                                <span className="block py-2 px-3 rounded md:p-0">
=======
                                <span className="block py-2 px-3 text-gray-900 rounded md:p-0 dark:text-white">
>>>>>>> 2d6fa44b2cbd66788de086c0ca1fd381d085dfd5
                                    {user?.displayName}
                                </span>
                            </li>
                            <li>
<<<<<<< HEAD
                                <a className="dropdown-button" href="/profile">Profile</a>
                            </li>
                            <li>
                                <a className="dropdown-button" href="/settings">Settings & Privacy</a>
                            </li>
                            <li>
                                <a className="dropdown-button" href="/help">Help</a>
                            </li>
                            <hr />
                            <li>
                                <button onClick={handleSignOut} className="dropdown-button">
=======
                                <a href="/profile">Profile</a>
                            </li>
                            <li>
                                <a href="/settings">Settings & Privacy</a>
                            </li>
                            <li>
                                <a href="/help">Help</a>
                            </li>
                            <hr />
                            <li>
                                <button onClick={handleSignOut} className="dropdown-logout-button">
>>>>>>> 2d6fa44b2cbd66788de086c0ca1fd381d085dfd5
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
