"use client"

import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";

interface ISubItem {
    name: string,
    path: string;
};

const SubMenuItem = ({ item } : { item: ISubItem }) => {
    const {name, path} = item;
    const router = useRouter();
    const pathname = usePathname();

    const onClickEvent = () => {
        router.push(path);
    };

    const isActive = useMemo(() => {
        return path === pathname;
    }, [path, pathname])

    return (
        <div className={`hover:font-semibold cursor-pointer ${isActive && "bg-stone-100 rounded-lg px-3"}`} onClick={onClickEvent}>
            <p>{name}</p>
        </div>
    );
}

export default SubMenuItem;