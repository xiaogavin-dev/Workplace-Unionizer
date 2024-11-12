import React from 'react'
import { useRouter } from 'next/navigation'
import "../resource-popup.css"
const unionPopup = ({ popupRef, openDropdowns, chats }: { popupRef: React.RefObject<HTMLDivElement>, openDropdowns: number[], chats: object[] }) => {
    const router = useRouter()

    return (
        <div className="resource-popup" ref={popupRef} onClick={(e) => e.stopPropagation()}>
            <h1 className="popup-title"></h1>
            <hr />
            <br />
            <ul className="resource-list">
                {/* Resource 1 Dropdown */}
                <li
                    onClick={() => { }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    className={`resources-title ${openDropdowns.includes(1) ? 'active' : ''}`}
                >
                    <span className={`arrow ${openDropdowns.includes(1) ? 'down' : ''}`} />

                </li>

            </ul>
        </div>
    )
}

export default unionPopup