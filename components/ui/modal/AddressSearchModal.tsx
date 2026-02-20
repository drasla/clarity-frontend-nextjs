"use client";

import DaumPostcode from "react-daum-postcode";
import { Modal } from "@/components/ui/modal/Modal";

export interface AddressData {
    zipcode: string;
    address: string;
}

export interface AddressSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: AddressData) => void;
}

export const AddressSearchModal = ({ isOpen, onClose, onComplete }: AddressSearchModalProps) => {
    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        onComplete({
            zipcode: data.zonecode,
            address: fullAddress,
        });

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="우편번호 검색" maxWidth="md">
            <div className="w-full h-100">
                <DaumPostcode
                    onComplete={handleComplete}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </Modal>
    );
};
