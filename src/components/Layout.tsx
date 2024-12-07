import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';
import { setUserUnions } from '@/lib/redux/features/user_unions/userUnionsSlice';
import VerticalNavbar from '@/components/vertical-navbar/vertical-navbar';
import HorizontalNavbar from '@/components/horizontal-navbar/horizontal-navbar';
import './resource-popup.css';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar/app-sidebar"
import DynamicSidebar from './dynamic-navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { user } = useAppSelector(state => state.auth)
    const { unions } = useAppSelector(state => state.userUnion)
    const [currUnion, setCurrUnion] = useState<object | null>(null)
    const dispatch = useAppDispatch()
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
    const handleUnionClick = (e: React.MouseEvent, union: object) => {
        e.stopPropagation();
        console.log(union.chats)
        console.log("Selected Union:", union);
        setCurrUnion(union)
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
                return "Resource Guide";
            case "/resources/forming-a-union":
                return "";
            case "/resources/organizing-a-strike":
                return "";
            case "/resources/knowing-your-rights":
                return "";
            case "/resources/negotiating-a-contract":
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
    useEffect(() => {
        if (pathname === '/resources') {
            setIsPopupOpen(true);
        }
        const getUserUnions = async () => {
            try {
                const userUnionsRes = await fetch(`http://localhost:5000/union/getUserUnions?userId=${user?.uid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                if (!userUnionsRes.ok) {
                    throw new Error('Response error')
                }
                const data = await userUnionsRes.json()
                // console.log(data.data)
                dispatch(setUserUnions({
                    unions: data.data
                }))
            } catch (e) {
                console.error('There was an error receiving user unions', e)
            }
        }
        getUserUnions()
    }, [user])
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
        <div className="h-[calc(100vh-80px)] page-wrapper mt-[80px] ml-[90px]">
            <div className="horizontal-navbar-container">
                <HorizontalNavbar pageName={getDynamicPageName()} />
            </div>
            <div className="h-[calc(100vh-80px)]">
                <div className="vertical-navbar-container">
                    <VerticalNavbar togglePopup={togglePopup} buttonRef={buttonRef} unions={unions} handleUnionClick={handleUnionClick} />
                </div>
                {currUnion ?
                    <SidebarProvider>
                        <AppSidebar
                            chats={currUnion?.chats || []}
                            unionName={currUnion?.name || ''}
                            unionId={currUnion?.id || ''}
                            role={currUnion?.role || ''}
                            userId={user?.uid}
                        />
                        <div className="page-content">
                            {children}
                        </div>
                    </SidebarProvider> : <div>{children}</div>}
            </div>

            {pathname.includes("settings") ?
                <DynamicSidebar /> : ""
            }

            {/* Resource Guide Pop-up */}
            {isPopupOpen && (
                <div className="resource-popup" ref={popupRef} onClick={(e) => e.stopPropagation()}>
                    <h1 className="popup-title">Resource Guide</h1>
                    <hr />
                    <br />
                    <ul className="resource-list">
                        {/* Resource 1 Dropdown */}
                        <li
                            onClick={() => toggleDropdown(1)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className={`resources-title ${openDropdowns.includes(1) ? 'active' : ''}`}
                        >
                            <span className={`arrow ${openDropdowns.includes(1) ? 'down' : ''}`} />
                            Resources 1
                        </li>
                        {openDropdowns.includes(1) && (
                            <ul className="nested-resources">
                                <li onClick={() => router.push('/resources')}># Links to External resources</li>
                            </ul>
                        )}
                        {/* Resource 2 Dropdown */}
                        <li
                            onClick={() => toggleDropdown(2)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className={`resources-title ${openDropdowns.includes(2) ? 'active' : ''}`}
                        >
                            <span className={`arrow ${openDropdowns.includes(2) ? 'down' : ''}`} />
                            Resources 2
                        </li>
                        {openDropdowns.includes(2) && (
                            <ul className="nested-resources">
                                <li onClick={() => router.push('/resources/forming-a-union')}># Forming a Union</li>
                                <li onClick={() => router.push('/resources/knowing-your-rights')}># Knowing Your Rights</li>
                            </ul>
                        )}

                        {/* Resource 3 Dropdown */}
                        <li
                            onClick={() => toggleDropdown(3)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className={`resources-title ${openDropdowns.includes(3) ? 'active' : ''}`}
                        >
                            <span className={`arrow ${openDropdowns.includes(3) ? 'down' : ''}`} />
                            Resources 3
                        </li>
                        {openDropdowns.includes(3) && (
                            <ul className="nested-resources">
                                <li onClick={() => router.push('/resources/organizing-a-strike')}># Organizing a Strike</li>
                                <li onClick={() => router.push('/resources/negotiating-a-contract')}># Negotiating a Contract</li>
                            </ul>
                        )}
                    </ul>
                    <li
                        onClick={() => router.push('/resources/find-an-employment-lawyer')}
                        className="find-lawyer-link"
                    >
                        Find a Lawyer
                    </li>

                </div>
            )}

        </div>
    );
};

export default Layout;
