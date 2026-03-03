"use client";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

import { UserRole, UserStatus, UserType } from "@/graphql/types.generated";
import { FindOneUserForAdminQuery } from "@/graphql/graphql.generated";

import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";
import { AlertModal, AlertType } from "@/components/ui/modal/AlertModal";
import {
    ModifyUserForAdminSchema,
    ModifyUserForAdminValues,
} from "@/actions/admin/user/modifyUserForAdmin/ModifyUserForAdminSchema";
import ModifyUserForAdminAction from "@/actions/admin/user/modifyUserForAdmin/ModifyUserForAdminAction";
import PageHeader from "@/components/ui/header/PageHeader";
import Card from "@/components/ui/card/Card";
import { UploadFileAction } from "@/actions/file/UploadAction";
import { IoCloseCircle } from "react-icons/io5";
import { AddressSearchModal } from "@/components/ui/modal/AddressSearchModal";

type AdminUserDetailData = FindOneUserForAdminQuery["findOneUserForAdmin"];

interface AdminUserDetailProps {
    initialData: AdminUserDetailData;
}

function AdminUserDetail({ initialData }: AdminUserDetailProps) {
    const router = useRouter();

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
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ModifyUserForAdminValues>({
        resolver: zodResolver(ModifyUserForAdminSchema),
        defaultValues: {
            type: UserType.Personal,
        },
    });

    const currentUserType = watch("type");

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber,
                landlineNumber: initialData.landlineNumber,
                agreeEmail: initialData.agreeEmail,
                agreeSms: initialData.agreeSMS,
                type: initialData.type,
                role: initialData.role,
                status: initialData.status,
                password: "",
                bizCeo: initialData.bizInfo?.bizCEO || "",
                bizRegNumber: initialData.bizInfo?.bizRegNumber || "",
                bizType: initialData.bizInfo?.bizType || "",
                bizItem: initialData.bizInfo?.bizItem || "",
                bizZipCode: initialData.bizInfo?.bizZipCode || "",
                bizAddress1: initialData.bizInfo?.bizAddress1 || "",
                bizAddress2: initialData.bizInfo?.bizAddress2 || "",
                bizLicenseUrl: initialData.bizInfo?.bizLicenseURL || "",
            });

            if (initialData.bizInfo?.bizLicenseURL) {
                setExistingLicenseUrl(initialData.bizInfo.bizLicenseURL);
            }
        }
    }, [initialData, reset]);

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

    const onSubmit = async (data: ModifyUserForAdminValues) => {
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

            const result = await ModifyUserForAdminAction(initialData.id, data);

            if (result.success) {
                setAlertConfig({
                    isOpen: true,
                    type: "success",
                    title: "수정 완료",
                    message: "회원 정보가 성공적으로 수정되었습니다.",
                    onClose: () => {
                        setAlertConfig(prev => ({ ...prev, isOpen: false }));
                        router.refresh();
                    },
                });
            }
        } catch (error: any) {
            setAlertConfig({
                isOpen: true,
                type: "error",
                title: "수정 실패",
                message: error.message || "회원 정보 수정 중 오류가 발생했습니다.",
                onClose: () => {
                    setAlertConfig(prev => ({ ...prev, isOpen: false }));
                },
            });
        }
    };

    return (
        <div className={twMerge(["w-full"])}>
            <PageHeader
                title="회원 상세 정보"
                description={`가입일: ${dayjs(initialData.createdAt).format("YYYY-MM-DD HH:mm")} | 최종 수정: ${dayjs(initialData.updatedAt).format("YYYY-MM-DD HH:mm")}`}
                action={
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => router.push("/admin/users")}>
                        목록으로
                    </Button>
                }
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(["w-full", "flex", "flex-col", "gap-6"])}>
                <Card>
                    <h2
                        className={twMerge(
                            ["pb-3", "mb-6"],
                            ["border-b", "border-divider-main/30"],
                            ["font-bold", "text-lg", "text-text-primary"],
                        )}>
                        계정 제어
                    </h2>

                    <div className={twMerge(["grid", "grid-cols-1", "md:grid-cols-2", "gap-6"])}>
                        <Input
                            label="아이디"
                            fullWidth
                            readOnly
                            disabled
                            value={initialData.username}
                            helperText="아이디는 변경할 수 없습니다."
                        />

                        <Input
                            label="새 비밀번호 (선택)"
                            type="password"
                            fullWidth
                            placeholder="변경 시에만 입력하세요"
                            error={!!errors.password}
                            helperText={
                                errors.password?.message ||
                                "입력하지 않으면 기존 비밀번호가 유지됩니다."
                            }
                            {...register("password")}
                        />

                        <Select
                            label="회원 권한"
                            fullWidth
                            error={!!errors.role}
                            helperText={errors.role?.message}
                            {...register("role")}
                            options={[
                                { label: "일반 회원", value: UserRole.User },
                                { label: "최고 관리자", value: UserRole.Admin },
                            ]}
                        />

                        <Select
                            label="계정 상태"
                            fullWidth
                            error={!!errors.status}
                            helperText={errors.status?.message}
                            {...register("status")}
                            options={[
                                { label: "정상 (Active)", value: UserStatus.Active },
                                { label: "이용 정지 (Suspended)", value: UserStatus.Suspended },
                                { label: "탈퇴 처리 (Withdrawn)", value: UserStatus.Withdrawn },
                            ]}
                        />
                    </div>
                </Card>

                <Card>
                    <h2
                        className={twMerge(
                            ["pb-3", "mb-6"],
                            ["border-b", "border-divider-main/30"],
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
                            label="유선전화"
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
                    <Card className={twMerge(["animate-in", "fade-in", "duration-500"])}>
                        <h2
                            className={twMerge(
                                ["pb-3", "mb-6"],
                                ["border-b", "border-divider-main/30"],
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
                                <span>이메일(안내 및 혜택) 수신 동의</span>
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
                                <span>SMS/알림톡 수신 동의</span>
                            </label>
                        </div>

                        <div
                            className={twMerge([
                                "flex",
                                "items-center",
                                "justify-end",
                                "pt-4",
                                "border-t",
                                "border-divider-main/30",
                            ])}>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "저장 중..." : "수정 내용 저장"}
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

export default AdminUserDetail;