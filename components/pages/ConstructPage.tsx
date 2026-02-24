"use client";

import { useRouter } from "next/navigation";
import { RiRocket2Line, RiSettings3Line } from "react-icons/ri";
import { Button } from "@/components/ui/button/Button";

function ConstructPage() {
    const router = useRouter();

    return (
        <main className="w-full flex flex-col items-center justify-center flex-1 py-12 px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary-main/20 rounded-full blur-2xl scale-150" />

                <div className="relative w-24 h-24 bg-background-default border-2 border-primary-main/30 rounded-full flex items-center justify-center shadow-lg">
                    <RiSettings3Line className="w-12 h-12 text-primary-main animate-[spin_4s_linear_infinite]" />

                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background-paper border border-divider-main rounded-full flex items-center justify-center shadow-sm">
                        <RiRocket2Line className="w-4 h-4 text-text-secondary" />
                    </div>
                </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-text-primary mb-4 tracking-tight">
                현재 <span className="text-primary-main">서비스 준비 중</span>입니다.
            </h1>

            <div className="text-text-secondary md:text-lg space-y-1 mb-10 leading-relaxed">
                <p>더 나은 서비스를 제공하기 위해 열심히 준비하고 있습니다.</p>
                <p>빠른 시일 내에 멋진 모습으로 찾아뵙겠습니다!</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto">
                <Button variant="outlined" fullWidth onClick={() => router.back()}>
                    이전 페이지
                </Button>
                <Button fullWidth onClick={() => router.push("/user")}>
                    대시보드 홈
                </Button>
            </div>
        </main>
    );
}

export default ConstructPage;