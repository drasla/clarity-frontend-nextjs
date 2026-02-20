"use server";

import { UploadFileValues, UploadFileSchema } from "./uploadSchema";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API || "http://localhost:8080/api";

export async function UploadFileAction(data: UploadFileValues) {
    try {
        const parsedData = UploadFileSchema.parse(data);
        const { file, directory } = parsedData;

        const formData = new FormData();

        const operations = {
            query: `
                mutation UploadFile($file: Upload!, $directory: String) {
                    uploadFile(file: $file, directory: $directory) {
                        fileName
                        url
                    }
                }
            `,
            variables: {
                file: null,
                directory: directory ?? null,
            },
        };
        formData.append("operations", JSON.stringify(operations));

        const map = {
            "0": ["variables.file"],
        };
        formData.append("map", JSON.stringify(map));

        formData.append("0", file);

        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0].message || "파일 업로드 실패");
        }

        return result.data.uploadFile;
    } catch (error: any) {
        throw new Error(error.message || "알 수 없는 업로드 오류");
    }
}
