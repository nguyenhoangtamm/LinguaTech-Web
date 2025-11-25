import authApiRequest from '@/apiRequests/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const cookieStore = cookies()
    const accessToken = (await cookieStore).get('accessToken')
    const refreshToken = (await cookieStore).get('refreshToken')
    if (!accessToken || !refreshToken) {
        (await cookieStore).delete('accessToken');
        (await cookieStore).delete('refreshToken');
        return Response.json(
            {
                message: 'Không nhận được access token hoặc refresh token, buộc phải xóa cookie'
            },
            {
                status: 200
            }
        )
    }
    try {
        const result = await authApiRequest.logoutFromNextServerToServer({
            accessToken: accessToken?.value,
            refreshToken: refreshToken?.value
        });
        (await cookieStore).delete('accessToken');
        (await cookieStore).delete('refreshToken');
        return Response.json(result)
    } catch (error) {
        (await cookieStore).delete('accessToken');
        (await cookieStore).delete('refreshToken');
        return Response.json(
            {
                message: 'Lỗi khi gọi API đến server backend, buộc phải xóa cookie'
            },
            {
                status: 200
            }
        )
    }
}
