import { HiExternalLink, HiSearch } from "react-icons/hi";
import { Button } from "@/components/ui/button/Button";

function RootPage() {
    return (
        <main className="flex flex-col w-full">
            {/* 1. 히어로 섹션: 서비스의 첫인상 */}
            <section className="relative w-full bg-background-paper py-20 md:py-32 px-4 overflow-hidden">
                {/* 배경 장식 (선택 사항: 골든넷 느낌의 은은한 원형 그라데이션) */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary-main/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8">
                        {/* 메인 카피 */}
                        <div className="space-y-4">
                            <h2 className="text-primary-main font-bold text-lg md:text-xl tracking-wider">
                                IT 비즈니스의 시작, 골든넷
                            </h2>
                            <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight">
                                당신의 아이디어를 <br />
                                <span className="text-primary-main">완벽한 도메인</span>으로
                                연결하세요
                            </h1>
                            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                도메인 등록부터 호스팅, 골든샵까지.{" "}
                                <br className="hidden md:block" />
                                안정적인 인프라와 함께 비즈니스 성장을 가속화하세요.
                            </p>
                        </div>

                        {/* 2. 도메인 검색바 섹션 */}
                        <div className="w-full max-w-3xl bg-background-default p-2 rounded-2xl shadow-xl border border-divider-main flex flex-col md:flex-row items-center gap-2">
                            <div className="flex-1 flex items-center px-4 w-full">
                                <HiSearch className="text-text-disabled w-6 h-6 mr-3" />
                                <input
                                    type="text"
                                    placeholder="원하는 도메인을 검색해 보세요 (예: goldennet.net)"
                                    className="w-full py-4 bg-transparent outline-none text-text-primary text-lg font-medium placeholder:text-text-disabled"
                                />
                            </div>
                            <Button
                                size="large"
                                className="w-full md:w-40 h-14 md:h-auto rounded-xl text-lg">
                                검색하기
                            </Button>
                        </div>

                        {/* 인기 도메인 확장자 태그 */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {[".com", ".net", ".kr", ".shop", ".me"].map(tld => (
                                <span
                                    key={tld}
                                    className="px-4 py-1.5 bg-background-default border border-divider-main rounded-full text-sm font-semibold text-text-secondary hover:border-primary-main hover:text-primary-main cursor-pointer transition-all">
                                    {tld}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. 서비스 퀵 링크 섹션 (카드 형태) */}
            <section className="max-w-7xl mx-auto w-full py-20 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ServiceCard
                        title="도메인 호스팅"
                        description="가장 합리적인 가격으로 시작하는 고성능 호스팅 서비스"
                        icon="hosting"
                    />
                    <ServiceCard
                        title="골든샵 입점"
                        description="누구나 쉽게 시작하는 나만의 온라인 쇼핑몰 플랫폼"
                        icon="shop"
                    />
                    <ServiceCard
                        title="보안인증서 (SSL)"
                        description="데이터를 안전하게 보호하고 고객의 신뢰를 확보하세요"
                        icon="security"
                    />
                </div>
            </section>
        </main>
    );
}

export default RootPage;

function ServiceCard({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: string;
}) {
    return (
        <div className="p-8 rounded-3xl border border-divider-main bg-background-default hover:shadow-2xl hover:border-primary-main transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-primary-main/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-main transition-colors">
                <HiExternalLink className="w-7 h-7 text-primary-main group-hover:text-primary-contrast" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
            <p className="text-text-secondary leading-relaxed mb-6">{description}</p>
            <span className="text-primary-main font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                더 알아보기 <HiExternalLink />
            </span>
        </div>
    );
}
