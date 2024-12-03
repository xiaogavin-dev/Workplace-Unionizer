import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './vertical-navbar.css';

const VerticalNavbar = ({ togglePopup, buttonRef, unions, handleUnionClick }: { togglePopup: () => void, buttonRef: React.RefObject<HTMLDivElement>, unions: object[] | null, handleUnionClick: (e: React.MouseEvent, union: object) => void }) => {
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
                    {
                        unions?.length ?
                            unions.map((union, ind) => {
                                return <div key={ind} className="navbar-item" onClick={(e: React.MouseEvent) => { handleUnionClick(e, union) }} style={{ backgroundColor: '#f39c12', display: 'flex', justifyContent: 'center' }}>{union.name[0]}</div>
                            }) : <></>
                    }

                    <a href="/search"><div className="add-button">+</div></a>
                </div>

                <img
                    src="/images/resource-guide-icon.png"
                    alt="books"
                    className="book-button"
                    ref={buttonRef} // Now properly typed as HTMLImageElement
                    onClick={handleBookButtonClick}
                    style={{ cursor: 'pointer' }}
                />

            </div>
        </div>
    );
};

export default VerticalNavbar;


