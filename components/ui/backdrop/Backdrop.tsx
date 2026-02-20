"use client";

import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

export interface BackdropProps {
    isOpen: boolean;
    onClick?: () => void;
    className?: string;
}

export const Backdrop = ({ isOpen, onClick, className }: BackdropProps) => {
    const [isRendered, setIsRendered] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    return (
        <div
            className={twMerge(
                ["fixed", "inset-0", "z-40", "bg-black/40", "backdrop-blur-[2px]"],
                ["transition-all", "duration-200", "ease-in-out"],
                isVisible ? "opacity-100" : "opacity-0",
                className,
            )}
            onClick={onClick}
            aria-hidden="true"
        />
    );
};
