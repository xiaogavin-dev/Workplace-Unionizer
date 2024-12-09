import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';
import { setUserUnions } from '@/lib/redux/features/user_unions/userUnionsSlice';
import VerticalNavbar from '@/components/vertical-navbar/vertical-navbar';
import HorizontalNavbar from '@/components/horizontal-navbar/horizontal-navbar';
import './resource-popup.css';
import { useSocket } from './socket/SocketProvider';
import DynamicSidebar from './dynamic-navbar';
import { listenToAuthChanges } from '@/lib/redux/features/auth/authSlice';
import { SocketProvider } from './socket/SocketProvider'
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
    // const socket = useSocket()
    // const socketRef = useRef(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const togglePopup = () => {
        setIsPopupOpen((prev) => !prev);
    };

    // useEffect(() => {
    //     if (socket) {
    //         socketRef.current = socket;

    //         // Check if the socket is connected
    //         setIsConnected(socket.connected);

    //         // Listen to the 'connect' and 'disconnect' events
    //         socket.on("connect", () => {
    //             console.log("Socket connected");
    //             setIsConnected(true);
    //         });

    //         socket.on("disconnect", () => {
    //             console.log("Socket disconnected");
    //             setIsConnected(false);
    //         });

    //         // Clean up listeners
    //         return () => {
    //             socket.off("connect");
    //             socket.off("disconnect");
    //         };
    //     }
    // }, [socket]);
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
        dispatch(listenToAuthChanges());
    }, [dispatch])
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
        if (user) {
            getUserUnions()
            // if (socketRef.current) {
            //     socketRef.current?.on("received_join_request", (data) => {
            //         if (data.userId != user.uid) {
            //             console.log("Notification IS BEING CALLED")

            //         }
            //     });
            // }
        }


    }, [user])
    useEffect(() => {
        if (pathname === '/resources') {
            setIsPopupOpen(true);
        }
    }, [pathname]);
    // useEffect(() => {
    //     if (user?.uid && socketRef.current) {
    //         socketRef.current.on("connect", () => {
    //             console.log("Socket connected");
    //             setIsConnected(true);
    //         });
    //     }
    // }, [user?.uid, socketRef.current])
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

        <div className=" page-wrapper mt-[85px] grow justify-center ml-[95px] mr-[5px] mb-[5px]">
            <div className="horizontal-navbar-container">
                <HorizontalNavbar pageName={getDynamicPageName()} />
            </div>
            <div className="flex items-center h-[calc(100vh-80px)] justify-center">
                <VerticalNavbar togglePopup={togglePopup} buttonRef={buttonRef} unions={unions} handleUnionClick={handleUnionClick} currUnion={currUnion} user={user}>
                    {children}
                </VerticalNavbar>
            </div>

            {/* {pathname.includes("settings") ?
                <DynamicSidebar /> : ""
            } */}

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
