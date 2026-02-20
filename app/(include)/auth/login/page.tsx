import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";

function LoginPage() {
    return (
        <div
            className={twMerge(
                ["w-full", "max-w-sm", "min-h-[calc(100dvh-70px)]", "mx-auto", "px-3", "py-10"],
                ["flex", "flex-col", "justify-center", "items-center", "gap-5"],
            )}>
            <Image
                src={"/assets/images/logo_goldennet.png"}
                alt={"Logo"}
                width={144}
                height={100}
                className={twMerge(["mb-10"])}
            />
            <Input label={"아이디"} fullWidth={true} />
            <Input label={"비밀번호"} type={"password"} fullWidth={true} />
            <Button fullWidth={true}>로그인</Button>
            <div className={twMerge(["w-full", "flex", "justify-between"], "text-xs")}>
                <Link href={"/auth/register"}>
                    아직 회원이 아니신가요?{" "}
                    <span className={twMerge(["font-bold", "text-primary-main"])}>회원가입</span>
                </Link>
                <Link href={"/auth/find"}>아이디/비밀번호 찾기</Link>
            </div>
        </div>
    );
}

export default LoginPage;
