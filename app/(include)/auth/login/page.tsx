"use client";

import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal, AlertType } from "@/components/ui/modal/AlertModal";
import { useForm } from "react-hook-form";
import { LoginFormSchema, LoginFormValues } from "@/actions/auth/login/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginAction } from "@/actions/auth/login/LoginAction";

function LoginPage() {
    const router = useRouter();

    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        type: AlertType;
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: "none",
        title: "",
        message: "",
    });

    const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            autoLogin: true,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await LoginAction(data);

            router.push("/");
            router.refresh();
        } catch (error: any) {
            setAlertConfig({
                isOpen: true,
                type: "error",
                title: "로그인 실패",
                message: error.message,
            });
        }
    };

    return (
        <div
            className={twMerge(
                ["w-full", "max-w-sm", "min-h-[calc(100dvh-70px)]", "mx-auto", "px-3", "py-10"],
                ["flex", "flex-col", "justify-center", "items-center", "gap-5"],
            )}>
            <div
                className={twMerge(
                    ["w-full", "mb-5"],
                    ["flex", "flex-col", "md:flex-row", "gap-5", "md:gap-0"],
                    ["justify-center", "items-center", "md:justify-between", "md:items-center"],
                )}>
                <Image
                    src={"/assets/images/logo_vertical_light.png"}
                    alt={"Logo"}
                    width={90}
                    height={68}
                />
                <div
                    className={twMerge([
                        "w-full",
                        "flex",
                        "flex-col",
                        "justify-center",
                        "items-center",
                        "md:items-end",
                    ])}>
                    <h1 className={twMerge(["text-2xl", "font-bold", "text-text-primary"])}>
                        로그인
                    </h1>
                    <p className={twMerge(["text-sm", "text-text-secondary", "mt-1"])}>
                        서비스 이용을 위해 로그인해주세요.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                <Input
                    label="아이디"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    {...register("username")}
                />

                <Input
                    label="비밀번호"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register("password")}
                />

                <div className="flex items-center justify-between text-sm mt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary transition-colors">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-primary-main rounded border-divider-main"
                            {...register("autoLogin")}
                        />
                        <span>자동 로그인</span>
                    </label>

                    <div className="flex items-center gap-3 text-text-secondary">
                        <Link
                            href="/auth/find-id"
                            className="hover:text-primary-main transition-colors">
                            아이디 찾기
                        </Link>
                        <span className="w-px h-3 bg-divider-main"></span>
                        <Link
                            href="/auth/find-pw"
                            className="hover:text-primary-main transition-colors">
                            비밀번호 찾기
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    fullWidth
                    size="large"
                    className="mt-2"
                    disabled={isSubmitting}>
                    {isSubmitting ? "로그인 중..." : "로그인"}
                </Button>
            </form>

            <div className="mt-8 text-sm text-text-secondary">
                아직 계정이 없으신가요?{" "}
                <Link
                    href="/auth/register"
                    className="font-bold text-primary-main hover:underline ml-1">
                    회원가입
                </Link>
            </div>

            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={closeAlert}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
            />
        </div>
    );
}

export default LoginPage;
