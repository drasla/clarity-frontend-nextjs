import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Link from "next/link";

function Header() {
    return (
        <div
            className={twMerge(
                ["sticky", "top-0", "w-full", "h-15", "backdrop-blur-xl", "z-30"],
                ["flex", "justify-center"],
                ["border-b", "border-gray-300"],
            )}>
            <header
                className={twMerge(
                    ["w-full", "max-w-7xl", "px-3"],
                    ["flex", "justify-between", "items-center"],
                )}>
                <Link href={"/"}>
                    <Image
                        src={"/assets/images/logo_goldennet.png"}
                        alt={"Logo"}
                        width={72}
                        height={50}
                    />
                </Link>
                <div className={twMerge(["flex", "items-center"])}>
                    <Link href={"/auth/login"}>로그인</Link>
                </div>
            </header>
        </div>
    );
}

export default Header;
