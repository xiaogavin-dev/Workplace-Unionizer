import React from "react";
import SubMenuItem from "./submenu-item";

interface ISideBarItem {
    name: string,
    path: string,
    items?: ISubItem[];
};

interface ISubItem {
    name: string,
    path: string;
};

const SideBarItem = ({ item }: { item: ISideBarItem }) => {
    const {name, items} = item;

    return ( 
        <div className="flex flex-col space-y-2">
            <p className="font-semibold text-xl">{name}</p>

            {items && items.length>0 && 
            (<div className="flex flex-col space-y-1 ml-5">{items.map(item => <SubMenuItem key={item.path} item={item}/>)}</div>)}
        </div>
    );
}

export default SideBarItem;