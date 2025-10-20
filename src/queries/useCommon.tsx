import {useQuery} from "@tanstack/react-query";
import commonApiRequest from "@/apiRequests/common";
import {SelectOption} from "@/types/menu.types";

export const useDepartmentListQuery = () => {
    return useQuery({
        queryKey: ['common', "departments"],
        queryFn: async () => {
            const departmentListQuery = await commonApiRequest.departments()
            const dataDepartments = departmentListQuery?.data;
            const tempData: SelectOption[] = []
            dataDepartments?.map((item, index) => {
                tempData.push({value: item.code, label: item.name});
            })
            return tempData
        }
    })
}


export const useUsersDepartmentListQuery = ({departmentId}: {departmentId: string | undefined}) => {
    return useQuery({
        queryKey: ['common', "departments", "users", departmentId],
        queryFn: async () => {
            if(!departmentId) return []
            const dataListQuery = await commonApiRequest.getUsersByDepartmentId(departmentId)
            const data = dataListQuery?.data;
            const tempData: SelectOption[] = []
            data?.map((item, index) => {
                tempData.push({value: item.userName, label: item.fullName});
            })
            return tempData
        }
    })
}
