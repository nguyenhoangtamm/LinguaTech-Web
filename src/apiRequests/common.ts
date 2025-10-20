import http from '@/lib/http'
import {DepartmentListResType, UserDepartmentListResType} from "@/schemaValidations/common.schema";

const controller = "common"
const commonApiRequest = {
    departments: () => http.get<DepartmentListResType>(`departments/get-all`),
    getUsersByDepartmentId: (departmentId: string | undefined) => http.get<UserDepartmentListResType>(`users/get-users-by-department/${departmentId}`),
}

export default commonApiRequest
