"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InquiryFragment } from "@/graphql/graphql.generated";
import { FindOneInquiryAction } from "@/actions/inquiry/findOne/FindOneInquiryAction";
import { HexagonLoader } from "@/components/ui/loader/HexagonLoader";
import { twMerge } from "tailwind-merge";
import SharedInquiryDetail from "@/components/pages/inquiry/detail/SharedInquiryDetail";

function UserInquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const inquiryId = parseInt(params.id as string, 10);

    const [isLoading, setIsLoading] = useState(true);
    const [inquiryData, setInquiryData] = useState<InquiryFragment | null>(null);

    useEffect(() => {
        const fetchInquiry = async () => {
            if (isNaN(inquiryId)) return;

            try {
                const data = await FindOneInquiryAction({ id: inquiryId });
                setInquiryData(data);
            } catch (error: any) {
                alert("문의 내역을 불러오는데 실패했거나 권한이 없습니다.");
                router.push("/user/inquiries");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInquiry().then(() => {});
    }, [inquiryId, router]);

    if (isLoading) {
        return (
            <div
                className={twMerge(
                    ["w-full", "min-h-[50vh]"],
                    ["flex", "flex-col", "items-center", "justify-center", "gap-4"],
                )}>
                <HexagonLoader className="w-16 h-16" />
                <span
                    className={twMerge([
                        "text-text-secondary",
                        "text-sm",
                        "font-medium",
                        "animate-pulse",
                    ])}>
                    문의 내역을 불러오는 중입니다...
                </span>
            </div>
        );
    }

    if (!inquiryData) return null;

    return (
        <SharedInquiryDetail
            title="나의 1:1 문의"
            description="작성하신 문의 내용과 답변을 확인할 수 있습니다."
            inquiryData={inquiryData}
            basePath="/user/inquiries"
        />
    );
}

export default UserInquiryDetailPage;
