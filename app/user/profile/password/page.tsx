"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { AlertModal, AlertType } from "@/components/ui/modal/AlertModal";
import {
    ChangePasswordSchema,
    ChangePasswordValues,
} from "@/actions/user/changePassword/ChangePasswordSchema";
import CheckPasswordAction from "@/actions/user/checkPassword/CheckPasswordAction";
import ChangePasswordAction from "@/actions/user/changePassword/ChangePasswordAction";
import PageHeader from "@/components/ui/header/PageHeader";
import Card from "@/components/ui/card/Card";

function UserPasswordChangePage() {
    const router = useRouter();

    const [isVerified, setIsVerified] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        type: AlertType;
        title: string;
        message: string;
        onClose: VoidFunction;
    }>({
        isOpen: false,
        type: "none",
        title: "",
        message: "",
        onClose: () => {},
    });

    const {
        register,
        handleSubmit,
        getValues,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordValues>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
        },
    });

    const handleCheckPassword = async () => {
        const oldPassword = getValues("oldPassword");

        if (!oldPassword) {
            setError("oldPassword", { message: "기존 비밀번호를 입력해주세요." });
            return;
        }

        setIsChecking(true);
        try {
            const result = await CheckPasswordAction({ password: oldPassword });

            if (result.success && result.isMatched) {
                setIsVerified(true);
                clearErrors("oldPassword");
            } else {
                setError("oldPassword", { message: "기존 비밀번호가 일치하지 않습니다." });
            }
        } catch (error: any) {
            setError("oldPassword", {
                message: error.message || "비밀번호 확인 중 오류가 발생했습니다.",
            });
        } finally {
            setIsChecking(false);
        }
    };

    const onSubmit = async (data: ChangePasswordValues) => {
        if (!isVerified) return;

        try {
            const result = await ChangePasswordAction(data);

            if (result.success) {
                setAlertConfig({
                    isOpen: true,
                    type: "success",
                    title: "변경 완료",
                    message: "비밀번호가 성공적으로 변경되었습니다.\n다시 로그인해 주세요.",
                    onClose: () => {
                        setAlertConfig(prev => ({ ...prev, isOpen: false }));
                        router.push("/auth/login");
                    },
                });
            }
        } catch (error: any) {
            setAlertConfig({
                isOpen: true,
                type: "error",
                title: "변경 실패",
                message: error.message || "비밀번호 변경 중 오류가 발생했습니다.",
                onClose: () => {
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                },
            });
        }
    };

    return (
        <div className={twMerge(["w-full"])}>
            <PageHeader
                title="비밀번호 변경"
                description="주기적인 비밀번호 변경을 통해 계정을 안전하게 보호하세요."
            />

            <Card>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={twMerge(["flex", "flex-col", "gap-6"])}>
                    <div className={twMerge(["w-full", "flex", "flex-col", "gap-5"])}>
                        <Input
                            label="기존 비밀번호"
                            type="password"
                            fullWidth
                            placeholder="현재 사용 중인 비밀번호를 입력해주세요."
                            error={!!errors.oldPassword}
                            helperText={errors.oldPassword?.message}
                            disabled={isVerified}
                            className={"bg-background-default"}
                            {...register("oldPassword")}
                        />

                        {!isVerified && (
                            <div className={twMerge(["flex", "justify-end"])}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    disabled={isChecking}
                                    onClick={handleCheckPassword}>
                                    {isChecking ? "확인 중..." : "비밀번호 확인"}
                                </Button>
                            </div>
                        )}
                    </div>

                    {isVerified && (
                        <div
                            className={twMerge(
                                ["flex", "flex-col", "gap-6"],
                                ["animate-in", "fade-in", "slide-in-from-top-4", "duration-500"],
                            )}>
                            <div className={twMerge(["w-full", "h-px", "bg-divider-main/50"])} />

                            <div className={twMerge(["w-full"])}>
                                <Input
                                    label="새 비밀번호"
                                    type="password"
                                    fullWidth
                                    placeholder="영문, 숫자, 특수문자 조합 8자 이상"
                                    error={!!errors.newPassword}
                                    helperText={errors.newPassword?.message}
                                    className={"bg-background-default"}
                                    {...register("newPassword")}
                                />
                            </div>

                            <div className={twMerge(["w-full"])}>
                                <Input
                                    label="새 비밀번호 확인"
                                    type="password"
                                    fullWidth
                                    placeholder="새 비밀번호를 다시 한 번 입력해주세요."
                                    error={!!errors.newPasswordConfirm}
                                    helperText={errors.newPasswordConfirm?.message}
                                    className={"bg-background-default"}
                                    {...register("newPasswordConfirm")}
                                />
                            </div>

                            <div
                                className={twMerge([
                                    "flex",
                                    "items-center",
                                    "justify-end",
                                    "gap-3",
                                    "mt-4",
                                ])}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    disabled={isSubmitting}>
                                    {isSubmitting ? "변경 중..." : "비밀번호 변경하기"}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </Card>

            <AlertModal
                isOpen={alertConfig.isOpen}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={alertConfig.onClose}
                buttonText="확인"
            />
        </div>
    );
}

export default UserPasswordChangePage;
