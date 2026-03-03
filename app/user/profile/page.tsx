"use client";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";
import { IoCloseCircle } from "react-icons/io5";
import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/graphql/types.generated";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { AddressSearchModal } from "@/components/ui/modal/AddressSearchModal";
import { AlertModal, AlertType } from "@/components/ui/modal/AlertModal";
import { UploadFileAction } from "@/actions/file/UploadAction";
import { ModifyUserSchema, ModifyUserValues } from "@/actions/user/modifyUser/ModifyUserSchema";
import ModifyUserAction from "@/actions/user/modifyUser/ModifyUserAction";
import PageHeader from "@/components/ui/header/PageHeader";
import Card from "@/components/ui/card/Card";

function UserProfileEditPage() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [bizFile, setBizFile] = useState<File | null>(null);
    const [existingLicenseUrl, setExistingLicenseUrl] = useState<string>("");
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
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ModifyUserValues>({
        resolver: zodResolver(ModifyUserSchema),
        defaultValues: {
            type: UserType.Personal,
        },
    });

    const currentUserType = watch("type");

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                landlineNumber: user.landlineNumber,
                agreeEmail: user.agreeEmail,
                agreeSms: user.agreeSMS,
                type: user.type,

                bizCeo: user.bizInfo?.bizCEO || "",
                bizRegNumber: user.bizInfo?.bizRegNumber || "",
                bizType: user.bizInfo?.bizType || "",
                bizItem: user.bizInfo?.bizItem || "",
                bizZipCode: user.bizInfo?.bizZipCode || "",
                bizAddress1: user.bizInfo?.bizAddress1 || "",
                bizAddress2: user.bizInfo?.bizAddress2 || "",
                bizLicenseUrl: user.bizInfo?.bizLicenseURL || "",
            });

            if (user.bizInfo?.bizLicenseURL) {
                setExistingLicenseUrl(user.bizInfo.bizLicenseURL);
            }
        }
    }, [user, reset]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setBizFile(file);
        setExistingLicenseUrl("");
        setValue("bizLicenseUrl", "");

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClearFile = (e: MouseEvent) => {
        e.stopPropagation();
        setBizFile(null);
        setExistingLicenseUrl("");
        setValue("bizLicenseUrl", "");

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (data: ModifyUserValues) => {
        try {
            if (data.type === UserType.Business && bizFile) {
                const formData = new FormData();
                formData.append("file", bizFile);
                formData.append("folder", "user/license");
                const uploadResult = await UploadFileAction(formData);
                data.bizLicenseUrl = uploadResult.url;
            } else if (data.type === UserType.Business && existingLicenseUrl) {
                data.bizLicenseUrl = existingLicenseUrl;
            }

            // 💡 3. 수정 액션 호출
            const result = await ModifyUserAction(data);

            if (result.success && result.user) {
                setUser(result.user);

                setAlertConfig({
                    isOpen: true,
                    type: "success",
                    title: "수정 완료",
                    message: "회원정보가 성공적으로 수정되었습니다.",
                    onClose: () => {
                        setAlertConfig(prev => ({ ...prev, isOpen: false }));
                    },
                });
            }
        } catch (error: any) {
            setAlertConfig({
                isOpen: true,
                type: "error",
                title: "수정 실패",
                message: error.message || "회원정보 수정 중 오류가 발생했습니다.",
                onClose: () => {
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                },
            });
        }
    };

    if (!user) return null;

    return (
        <div className={twMerge(["w-full"])}>
            <PageHeader
                title="회원 정보 수정"
                description="최신 정보로 유지하여 원활한 서비스를 이용해 보세요."
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(["w-full", "flex", "flex-col", "gap-8"])}>
                <Card>
                    <h2
                        className={twMerge(
                            ["pb-3", "mb-6"],
                            ["border-b", "border-divider-main"],
                            ["font-bold", "text-lg", "text-text-primary"],
                        )}>
                        기본 정보
                    </h2>

                    <div className={twMerge(["grid", "grid-cols-1", "md:grid-cols-2", "gap-6"])}>
                        <div className={twMerge(["md:col-span-2"])}>
                            <Select
                                {...register("type")}
                                error={!!errors.type}
                                helperText={errors.type?.message}
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
                            readOnly
                            disabled
                            value={user.username}
                            helperText="아이디는 변경할 수 없습니다."
                        />

                        <div className={twMerge(["flex", "items-start", "gap-2"])}>
                            <div className={twMerge(["flex-1"])}>
                                <Input
                                    label="비밀번호"
                                    type="password"
                                    fullWidth
                                    readOnly
                                    disabled
                                    value="********"
                                    helperText="비밀번호는 별도 페이지에서 변경 가능합니다."
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outlined"
                                color="primary"
                                className={twMerge(["h-12.5", "whitespace-nowrap"])}
                                onClick={() => router.push("/user/profile/password")}>
                                변경하기
                            </Button>
                        </div>

                        <Input
                            label={currentUserType === UserType.Personal ? "이름" : "사업자명"}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            {...register("name")}
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
                </Card>

                {currentUserType === UserType.Business && (
                    <Card
                        className={twMerge(
                            ["animate-in", "fade-in", "slide-in-from-top-4", "duration-500"],
                        )}>
                        <h2
                            className={twMerge(
                                ["pb-3", "mb-6"],
                                ["border-b", "border-divider-main"],
                                ["font-bold", "text-lg", "text-text-primary"],
                            )}>
                            사업자 정보
                        </h2>

                        <div
                            className={twMerge(["grid", "grid-cols-1", "md:grid-cols-2", "gap-6"])}>
                            <Input
                                label="대표자명"
                                fullWidth
                                error={!!errors.bizCeo}
                                helperText={errors.bizCeo?.message}
                                {...register("bizCeo")}
                            />

                            <Input
                                label="사업자등록번호"
                                fullWidth
                                error={!!errors.bizRegNumber}
                                helperText={errors.bizRegNumber?.message}
                                formatType={"bizRegNum"}
                                {...register("bizRegNumber")}
                            />

                            <div
                                className={twMerge([
                                    "md:col-span-2",
                                    "flex",
                                    "gap-2",
                                    "items-start",
                                ])}>
                                <div
                                    className={twMerge(["flex-1", "relative", "cursor-pointer"])}
                                    onClick={() => fileInputRef.current?.click()}>
                                    <Input
                                        label="사업자등록증"
                                        fullWidth
                                        readOnly
                                        value={
                                            bizFile
                                                ? bizFile.name
                                                : existingLicenseUrl
                                                  ? "등록된 첨부파일이 있습니다."
                                                  : ""
                                        }
                                        className={twMerge(
                                            ["cursor-pointer"],
                                            (bizFile || existingLicenseUrl) && ["pr-10"],
                                        )}
                                        error={!!errors.bizLicenseUrl}
                                        helperText={errors.bizLicenseUrl?.message}
                                    />

                                    {(bizFile || existingLicenseUrl) && (
                                        <button
                                            type="button"
                                            onClick={handleClearFile}
                                            className={twMerge(
                                                ["absolute", "right-3", "top-0"],
                                                [
                                                    "h-12.5",
                                                    "flex",
                                                    "items-center",
                                                    "justify-center",
                                                ],
                                                [
                                                    "text-text-secondary",
                                                    "z-30",
                                                    "transition-colors",
                                                ],
                                                ["hover:text-error-main"],
                                            )}
                                            title="파일 삭제">
                                            <IoCloseCircle className={twMerge(["w-5", "h-5"])} />
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className={twMerge(["hidden"])}
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                />

                                <Button
                                    type="button"
                                    variant="outlined"
                                    color={bizFile || existingLicenseUrl ? "success" : "primary"}
                                    className={twMerge(["h-12.5", "whitespace-nowrap"])}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSubmitting}>
                                    {bizFile || existingLicenseUrl ? "다시 첨부" : "파일 첨부"}
                                </Button>
                            </div>

                            <Input
                                label="업태"
                                fullWidth
                                error={!!errors.bizType}
                                helperText={errors.bizType?.message}
                                {...register("bizType")}
                            />

                            <Input
                                label="업종"
                                fullWidth
                                error={!!errors.bizItem}
                                helperText={errors.bizItem?.message}
                                {...register("bizItem")}
                            />

                            <div
                                className={twMerge([
                                    "md:col-span-2",
                                    "flex",
                                    "gap-2",
                                    "items-start",
                                ])}>
                                <div className={twMerge(["flex-1"])}>
                                    <Input
                                        label="우편번호"
                                        fullWidth
                                        readOnly
                                        className={twMerge(["cursor-pointer"])}
                                        error={!!errors.bizZipCode}
                                        helperText={errors.bizZipCode?.message}
                                        {...register("bizZipCode")}
                                        onClick={() => setIsAddressModalOpen(true)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    className={twMerge(["h-12.5", "whitespace-nowrap"])}
                                    onClick={() => setIsAddressModalOpen(true)}>
                                    주소 검색
                                </Button>
                            </div>

                            <div className={twMerge(["md:col-span-2"])}>
                                <Input
                                    label="기본 주소"
                                    fullWidth
                                    readOnly
                                    error={!!errors.bizAddress1}
                                    helperText={errors.bizAddress1?.message}
                                    {...register("bizAddress1")}
                                />
                            </div>

                            <div className={twMerge(["md:col-span-2"])}>
                                <Input
                                    label="상세 주소"
                                    fullWidth
                                    error={!!errors.bizAddress2}
                                    helperText={errors.bizAddress2?.message}
                                    {...register("bizAddress2")}
                                />
                            </div>
                        </div>
                    </Card>
                )}

                <Card>
                    <div className={twMerge(["flex", "flex-col", "gap-6"])}>
                        <div
                            className={twMerge([
                                "flex",
                                "flex-col",
                                "gap-3",
                                "text-sm",
                                "text-text-primary",
                            ])}>
                            <label
                                className={twMerge([
                                    "flex",
                                    "items-center",
                                    "gap-2",
                                    "cursor-pointer",
                                    "w-fit",
                                ])}>
                                <input
                                    type="checkbox"
                                    className={twMerge([
                                        "w-4",
                                        "h-4",
                                        "accent-primary-main",
                                        "rounded",
                                    ])}
                                    {...register("agreeEmail")}
                                />
                                <span>이메일(안내 및 혜택) 수신에 동의합니다.</span>
                            </label>

                            <label
                                className={twMerge([
                                    "flex",
                                    "items-center",
                                    "gap-2",
                                    "cursor-pointer",
                                    "w-fit",
                                ])}>
                                <input
                                    type="checkbox"
                                    className={twMerge([
                                        "w-4",
                                        "h-4",
                                        "accent-primary-main",
                                        "rounded",
                                    ])}
                                    {...register("agreeSms")}
                                />
                                <span>SMS/알림톡 수신에 동의합니다.</span>
                            </label>
                        </div>

                        <div
                            className={twMerge([
                                "flex",
                                "items-center",
                                "justify-end",
                                "pt-4",
                                "border-t",
                                "border-divider-main/50",
                            ])}>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "저장 중..." : "수정 완료"}
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>

            <AddressSearchModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onComplete={data => {
                    setValue("bizZipCode", data.zipcode, { shouldValidate: true });
                    setValue("bizAddress1", data.address, { shouldValidate: true });
                }}
            />

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

export default UserProfileEditPage;
