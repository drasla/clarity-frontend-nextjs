"use client";

import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { UserType } from "@/graphql/types.generated";
import { Select } from "@/components/ui/select/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { RegisterFormSchema, RegisterFormValues } from "@/actions/auth/register/RegisterSchema";
import { RegisterAction } from "@/actions/auth/register/RegisterAction";
import { UploadFileAction } from "@/actions/file/UploadAction";
import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { AddressSearchModal } from "@/components/ui/modal/AddressSearchModal";
import { AlertModal, AlertType } from "@/components/ui/modal/AlertModal";

function RegisterPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [bizFile, setBizFile] = useState<File | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
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
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            userType: UserType.Personal,
            agreeEmail: false,
            agreeSMS: false,
        },
    });

    const currentUserType = watch("userType");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setBizFile(file);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClearFile = (e: MouseEvent) => {
        e.stopPropagation();
        setBizFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            if (data.userType === UserType.Business && bizFile) {
                const uploadResult = await UploadFileAction({
                    file: bizFile,
                    directory: "user/license",
                });
                if (data.bizInfo) {
                    data.bizInfo.bizLicenseURL = uploadResult.url;
                }
            }
            await RegisterAction(data);
            setAlertConfig({
                isOpen: true,
                type: "success",
                title: "회원가입 완료",
                message: "성공적으로 회원가입이 완료되었습니다.\n로그인 페이지로 이동합니다.",
                onClose: () => {
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                    router.push("/auth/login");
                },
            });
        } catch (error: any) {
            setAlertConfig({
                isOpen: true,
                type: "error",
                title: "가입 실패",
                message: error.message || "회원가입 중 일시적인 오류가 발생했습니다.",
                onClose: () => {
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                },
            });
        }
    };

    return (
        <div
            className={twMerge(
                ["w-full", "max-w-2xl", "min-h-[calc(100dvh-70px)]", "mx-auto", "px-3", "py-10"],
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
                        회원가입
                    </h1>
                    <p className={twMerge(["text-sm", "text-text-secondary", "mt-1"])}>
                        필요한 정보를 입력해주세요.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(["w-full", "flex", "flex-col", "gap-6"])}>
                <div className={twMerge(["w-full"])}>
                    <h2
                        className={twMerge(
                            ["px-3", "pb-3", "mb-3"],
                            ["border-b", "border-divider-main", "font-bold", "text-lg"],
                        )}>
                        회원정보 입력
                    </h2>

                    <div className={twMerge(["grid", "grid-cols-1", "md:grid-cols-2", "gap-4"])}>
                        <div className={"md:col-span-2"}>
                            <Select
                                {...register("userType")}
                                error={!!errors.userType}
                                helperText={errors.userType?.message}
                                label="회원 유형"
                                fullWidth
                                options={[
                                    { label: "개인 회원", value: UserType.Personal },
                                    { label: "사업자 회원", value: UserType.Business },
                                ]}
                            />
                        </div>
                        <Input
                            label="아이디"
                            fullWidth
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            {...register("username")}
                        />
                        {currentUserType === UserType.Personal && (
                            <Input
                                label="이름"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                {...register("name")}
                            />
                        )}
                        {currentUserType === UserType.Business && (
                            <div className="hidden md:block"></div>
                        )}
                        <Input
                            label="비밀번호"
                            type="password"
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            {...register("password")}
                        />
                        <Input
                            label="비밀번호 확인"
                            type="password"
                            fullWidth
                            error={!!errors.passwordConfirm}
                            helperText={errors.passwordConfirm?.message}
                            {...register("passwordConfirm")}
                        />

                        <Input
                            label="이메일"
                            type="email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register("email")}
                        />
                        <Input
                            label="휴대전화"
                            type="tel"
                            fullWidth
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                            formatType={"phone"}
                            {...register("phoneNumber")}
                        />

                        <div className="md:col-span-2">
                            <Input
                                label="유선전화 (선택)"
                                type="tel"
                                fullWidth
                                error={!!errors.landlineNumber}
                                helperText={errors.landlineNumber?.message}
                                formatType={"landline"}
                                {...register("landlineNumber")}
                            />
                        </div>
                    </div>
                </div>

                {currentUserType === UserType.Business && (
                    <div className="w-full animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2
                            className={twMerge([
                                "px-2",
                                "pb-2",
                                "mb-4",
                                "border-b",
                                "border-divider-main",
                                "font-bold",
                                "text-lg",
                            ])}>
                            사업자 정보 입력
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="사업자명"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                {...register("name")}
                            />
                            <Input
                                label="대표자명"
                                fullWidth
                                error={!!(errors as any).bizInfo?.bizCEO}
                                helperText={(errors as any).bizInfo?.bizCEO.message}
                                {...register("bizInfo.bizCEO")}
                            />

                            <div className="md:col-span-2">
                                <Input
                                    label="사업자등록번호"
                                    fullWidth
                                    helperText={(errors as any).bizInfo?.bizRegNumber?.message}
                                    error={!!(errors as any).bizInfo?.bizRegNumber}
                                    {...register("bizInfo.bizRegNumber")}
                                    formatType={"bizRegNum"}
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-2 items-start">
                                <div
                                    className="flex-1 cursor-pointer relative"
                                    onClick={() => fileInputRef.current?.click()}>
                                    <Input
                                        label="사업자등록증"
                                        fullWidth
                                        readOnly
                                        value={bizFile ? bizFile.name : ""}
                                        className={twMerge("cursor-pointer", bizFile && "pr-10")}
                                        error={!!(errors as any).bizInfo?.bizLicenseURL}
                                        helperText={(errors as any).bizInfo?.bizLicenseURL?.message}
                                    />

                                    {bizFile && (
                                        <button
                                            type="button"
                                            onClick={handleClearFile}
                                            className="absolute right-3 top-0 h-11.5 flex items-center justify-center text-text-secondary hover:text-error-main z-30 transition-colors"
                                            title="파일 삭제">
                                            <IoCloseCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                />

                                <Button
                                    type="button"
                                    variant="outlined"
                                    color={bizFile ? "success" : "primary"}
                                    size="medium"
                                    className="whitespace-nowrap h-11.5"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSubmitting}>
                                    {bizFile ? "다시 첨부" : "파일 첨부"}
                                </Button>
                            </div>

                            <Input
                                label="업태"
                                fullWidth
                                error={!!(errors as any).bizInfo?.bizType}
                                helperText={(errors as any).bizInfo?.bizType?.message}
                                {...register("bizInfo.bizType")}
                            />
                            <Input
                                label="업종"
                                fullWidth
                                error={!!(errors as any).bizInfo?.bizItem}
                                helperText={(errors as any).bizInfo?.bizItem?.message}
                                {...register("bizInfo.bizItem")}
                            />

                            <div className="md:col-span-2 flex gap-2 items-start">
                                <div className="flex-1">
                                    <Input
                                        label="우편번호"
                                        fullWidth
                                        readOnly
                                        className="cursor-pointer"
                                        error={!!(errors as any).bizInfo?.bizZipCode}
                                        helperText={(errors as any).bizInfo?.bizZipCode?.message}
                                        {...register("bizInfo.bizZipCode")}
                                        onClick={() => setIsAddressModalOpen(true)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    size="medium"
                                    className="whitespace-nowrap h-11.5"
                                    onClick={() => setIsAddressModalOpen(true)}>
                                    주소 검색
                                </Button>
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    label="기본 주소"
                                    fullWidth
                                    readOnly
                                    error={!!(errors as any).bizInfo?.bizAddress1}
                                    helperText={(errors as any).bizInfo?.bizAddress1?.message}
                                    {...register("bizInfo.bizAddress1")}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Input
                                    label="상세 주소"
                                    fullWidth
                                    error={!!(errors as any).bizInfo?.bizAddress2}
                                    helperText={(errors as any).bizInfo?.bizAddress2?.message}
                                    {...register("bizInfo.bizAddress2")}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full flex flex-col gap-6 mt-2">
                    <div className="flex flex-col gap-3 px-2 text-sm text-text-secondary">
                        <label className="flex items-center gap-2 cursor-pointer w-fit">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-primary-main rounded"
                                {...register("agreeEmail")}
                            />
                            <span>이메일 수신 동의 (선택)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer w-fit">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-primary-main rounded"
                                {...register("agreeSMS")}
                            />
                            <span>SMS 수신 동의 (선택)</span>
                        </label>
                    </div>

                    <Button type="submit" fullWidth size="large" disabled={isSubmitting}>
                        {isSubmitting ? "가입 처리 중..." : "가입하기"}
                    </Button>

                    <div className="w-full text-center text-sm text-text-secondary">
                        <Link href={"/auth/login"}>
                            이미 계정이 있으신가요?{" "}
                            <span className="font-bold text-primary-dark">로그인</span>
                        </Link>
                    </div>
                </div>
            </form>

            <AddressSearchModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onComplete={data => {
                    setValue("bizInfo.bizZipCode", data.zipcode, { shouldValidate: true });
                    setValue("bizInfo.bizAddress1", data.address, { shouldValidate: true });
                }}
            />

            <AlertModal
                isOpen={alertConfig.isOpen}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={alertConfig.onClose}
                buttonText={alertConfig.type === "success" ? "로그인하러 가기" : "확인"}
            />
        </div>
    );
}

export default RegisterPage;
