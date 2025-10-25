import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { RegisterBodyType } from "@/schemaValidations/auth.schema";

export async function POST(request: Request) {
    const res = (await request.json()) as RegisterBodyType;

    try {
        const response = await authApiRequest.SRegister(res);

        if (!response) {
            throw new Error("Lỗi không xác định khi đăng ký");
        }

        return Response.json(response, {
            status: 200,
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            });
        } else {
            return Response.json(
                {
                    message: "Lỗi không xác định khi đăng ký tài khoản",
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                {
                    status: 500,
                }
            );
        }
    }
}
