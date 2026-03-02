"use server";

import { UploadFileSchema } from "./UploadSchema";
import { FileInfo } from "@/graphql/types.generated";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API || "http://localhost:8080/api";

export async function UploadFileAction(clientFormData: FormData): Promise<FileInfo> {
    try {
        const rawData = {
            file: clientFormData.get("file"),
            directory: clientFormData.get("directory")?.toString() || undefined,
        };

        const parsedData = UploadFileSchema.parse(rawData);
        const graphqlFormData = new FormData();

        const operations = {
            query: `
                mutation UploadFile($file: Upload!, $directory: String) {
                    uploadFile(file: $file, directory: $directory) {
                        extension
                        originalName
                        size
                        storedName
                        url
                    }
                }
            `,
            variables: {
                file: null,
                directory: parsedData.directory ?? null,
            },
        };
        graphqlFormData.append("operations", JSON.stringify(operations));

        const map = {
            "0": ["variables.file"],
        };
        graphqlFormData.append("map", JSON.stringify(map));

        graphqlFormData.append("0", parsedData.file as File);

        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            body: graphqlFormData,
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
