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

    const defaultImage = "/images/Unionizer_Logo.png";

    return (
        <div className="main-container">
            <div className="vertical-navbar">
                <div className="navbar-items">
                    {
                        unions?.length ?
                            unions.map((union, ind) => {
                                return <div key={ind} className="navbar-item" onClick={(e: React.MouseEvent) => { handleUnionClick(e, union) }} style={{ display: 'flex', justifyContent: 'center' }}><img
                                    src={`http://localhost:5000${union.image}`}
                                    alt={`${union.name} Logo`}
                                    className="union-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultImage;
                                    }}
                                /></div>
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


