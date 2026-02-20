"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button/Button";
import { twMerge } from "tailwind-merge";

export type AlertType = "success" | "error" | "warning" | "none";

export interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
    type?: AlertType;
}

const LOTTIE_MAP: Record<string, string> = {
    success: "/assets/lottie/success.json",
    error: "/assets/lottie/error.json",
};

export const AlertModal = ({
    isOpen,
    onClose,
    title = "성공적으로 완료되었습니다!",
    message,
    buttonText = "확인",
    type = "none",
}: AlertModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" hideCloseButton>
            <div
                className={twMerge(
                    ["flex", "flex-col", "items-center", "justify-center"],
                    ["pt-6", "pb-2", "text-center"],
                )}>
                {type !== "none" && LOTTIE_MAP[type] && (
                    <div className="w-32 h-32 mb-4">
                        <Player
                            autoplay
                            keepLastFrame
                            src={LOTTIE_MAP[type]}
                            style={{ height: "100%", width: "100%" }}
                        />
                    </div>
                )}

                {title && (
                    <h3 className={twMerge(["text-xl", "font-bold", "text-text-primary", "mb-2"])}>
                        {title}
                    </h3>
                )}
                {message && (
                    <p
                        className={twMerge(
                            ["text-sm", "text-text-secondary", "mb-8"],
                            ["whitespace-pre-wrap", "leading-relaxed"],
                        )}>
                        {message}
                    </p>
                )}

                <Button fullWidth onClick={onClose} color={type === "error" ? "error" : "success"}>
                    {buttonText}
                </Button>
            </div>
        </Modal>
    );
};
