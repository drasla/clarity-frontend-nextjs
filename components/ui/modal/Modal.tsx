"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { IoClose } from "react-icons/io5";
import { Backdrop } from "@/components/ui/backdrop/Backdrop";

export interface ModalProps {
    isOpen: boolean;
    onClose: VoidFunction;
    title?: ReactNode;
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
    className?: string;
    hideCloseButton?: boolean;
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "md",
    className,
    hideCloseButton = false,
}: ModalProps) => {
    const [mounted, setMounted] = useState(false);
    const [isRendered, setIsRendered] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isOpen) {
            setIsRendered(true);

            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
            document.body.style.overflow = "hidden";

            timer = setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            document.body.style.paddingRight = "";
            document.body.style.overflow = "";

            timer = setTimeout(() => {
                setIsRendered(false);
            }, 200);
        }

        return () => clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        return () => {
            document.body.style.paddingRight = "";
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!mounted || !isRendered) return null;

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full m-4",
    };

    return createPortal(
        <div
            className={twMerge(
                ["fixed", "inset-0", "z-50", "p-4"],
                ["flex", "items-center", "justify-center"],
            )}>
            <Backdrop
                isOpen={true}
                onClick={onClose}
                className={twMerge(["absolute", "inset-0", "z-[-1]"])}
            />

            <div
                role="dialog"
                aria-modal="true"
                className={twMerge(
                    ["relative", "w-full", "flex", "flex-col"],
                    ["rounded-xl", "shadow-2xl", "border", "border-divider-main"],
                    ["bg-background-default", "overflow-hidden"],
                    ["transition-all", "duration-200", "ease-in-out", "transform"],
                    isVisible
                        ? ["opacity-100", "scale-100", "translate-y-0"]
                        : ["opacity-0", "scale-95", "translate-y-2"],
                    maxWidthClasses[maxWidth],
                    className,
                )}>
                {(title || !hideCloseButton) && (
                    <div
                        className={twMerge(
                            ["flex", "items-center", "justify-between", "px-5", "py-4"],
                            ["border-b", "border-divider-main", "bg-background-paper"],
                        )}>
                        <div
                            className={twMerge(
                                ["text-lg", "font-bold", "text-text-primary"],
                                ["flex-1", "truncate"],
                            )}>
                            {title}
                        </div>
                        {!hideCloseButton && (
                            <button
                                onClick={onClose}
                                className={twMerge(
                                    ["ml-4", "text-text-secondary", "rounded-md"],
                                    ["hover:text-error-main", "focus:outline-none"],
                                    "transition-colors",
                                )}
                                aria-label="닫기">
                                <IoClose className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                )}

                <div className={twMerge(["p-5", "overflow-y-auto", "max-h-[calc(100vh-10rem)]"])}>
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
};
