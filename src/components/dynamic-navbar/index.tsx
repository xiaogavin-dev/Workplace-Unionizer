import React from 'react'
import SideBarItem from './item';

interface ISideBarItem {
    name: string,
    path: string,
    items?: ISubItem[];
};

interface ISubItem {
    name: string,
    path: string;
};

const items: ISideBarItem[] = [
    {
        name: "Basic",
        path: "/settings/basic",
        items: [
            {
                name: "Profile",
                path: "/settings/basic/profile"
            },
            {
                name: "Email",
                path: "/settings/basic/email"
            },
            {
                name: "Password",
                path: "/settings/basic/password"
            }
        ]
    },
    {
        name: "Contact",
        path: "/settings/contact",
        items: [
            {
                name: "Notifications",
                path: "/settings/contact/notifications"
            }
        ]
    },
    {
        name: "Misc",
        path: "/settings/misc",
        items: [
            {
                name: "Delete Account",
                path: "/settings/misc/delete-account"
            }
        ]
    }
]

const DynamicSidebar = () => {
    return (
        <div className='h-[calc(100vh-80px)] w-64 bg-white shadow-lg flex justify-start fixed top-20 p-4 left-20'>
            <div className='flex flex-col w-full'>
                {items.map(item => (
                    <SideBarItem key={item.path} item={item} />
                ))}
            </div>
        </div>
    );
}

export default DynamicSidebar;