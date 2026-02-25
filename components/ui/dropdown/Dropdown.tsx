"use client";

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { IconType } from "react-icons";

interface DropdownContextType {
    isOpen: boolean;
    toggle: VoidFunction;
    close: VoidFunction;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdown() {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("Dropdown 컴포넌트 내부에서 사용되어야 합니다.");
    return context;
}

interface DropdownProps {
    children: ReactNode;
    className?: string;
}

export const Dropdown = ({ children, className }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggle = () => setIsOpen(prev => !prev);
    const close = () => setIsOpen(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                close();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <DropdownContext.Provider value={{ isOpen, toggle, close }}>
            <div
                ref={dropdownRef}
                className={twMerge(["relative", "inline-block", "text-left"], className)}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

export const DropdownTrigger = ({ children, className }: DropdownProps) => {
    const { toggle } = useDropdown();
    return (
        <div onClick={toggle} className={twMerge("cursor-pointer", className)}>
            {children}
        </div>
    );
};

export const DropdownMenu = ({
    children,
    align = "right",
    position = "bottom",
    className,
}: {
    children: ReactNode;
    align?: "left" | "right";
    position?: "top" | "bottom";
    className?: string;
}) => {
    const { isOpen } = useDropdown();
    const menuRef = useRef<HTMLDivElement>(null);
    const [currentAlign, setCurrentAlign] = useState(align);
    const [currentPosition, setCurrentPosition] = useState(position);

    useEffect(() => {
        if (isOpen && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();

            if (align === "right" && rect.left < 0) setCurrentAlign("left");
            else if (align === "left" && rect.right > window.innerWidth) setCurrentAlign("right");
            else setCurrentAlign(align);

            if (position === "bottom" && rect.bottom > window.innerHeight)
                setCurrentPosition("top");
            else if (position === "top" && rect.top < 0) setCurrentPosition("bottom");
            else setCurrentPosition(position);
        }
    }, [isOpen, align]);

    const yClass = currentPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2";
    const xClass = currentAlign === "right" ? "right-0" : "left-0";
    const originClass = `origin-${currentPosition}-${currentAlign}`;

    return (
        <div
            className={twMerge(
                ["absolute", "top-full", "mt-2", "w-48", "z-50", "py-1", "flex", "flex-col"],
                ["bg-background-paper", "border", "border-divider-main", "rounded-xl", "shadow-lg"],
                ["overflow-hidden", "transition-all", "duration-200", "ease-out"],
                yClass,
                xClass,
                originClass,
                isOpen
                    ? ["opacity-100", "scale-100", "visible", "pointer-events-auto"]
                    : ["opacity-0", "scale-95", "invisible", "pointer-events-none"],
                className,
            )}>
            {children}
        </div>
    );
};

interface DropdownItemProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    icon?: IconType;
    className?: string;
}

export const DropdownItem = ({
    children,
    href,
    onClick,
    icon: Icon,
    className,
}: DropdownItemProps) => {
    const { close } = useDropdown();

    const baseClass = twMerge(
        ["block", "w-full", "px-4", "py-3", "group", "flex", "items-center", "gap-2"],
        ["text-sm", "font-medium", "text-text-primary"],
        ["hover:bg-background-default", "hover:text-primary-main", "transition-colors"],
        className,
    );

    const handleClick = () => {
        if (onClick) onClick();
        close();
    };

    const content = (
        <>
            {Icon && (
                <Icon
                    className={twMerge(
                        ["w-4.5", "h-4.5", "text-text-secondary"],
                        ["group-hover:text-primary-main", "transition-colors"],
                        className
                    )}
                />
            )}
            <span>{children}</span>
        </>
    );

    if (href)
        return (
            <Link href={href} onClick={handleClick} className={baseClass}>
                {content}
            </Link>
        );
    return (
        <button onClick={handleClick} className={baseClass}>
            {content}
        </button>
    );
};
