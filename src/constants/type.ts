import {SelectOptionType} from "@/schemaValidations/common.schema";

export const TokenType = {
    ForgotPasswordToken: 'ForgotPasswordToken',
    AccessToken: 'AccessToken',
    RefreshToken: 'RefreshToken',
    TableToken: 'TableToken'
} as const

export const Role = {
    Owner: 'Owner',
    Employee: 'Employee',
    Guest: 'Guest'
} as const

export const RoleValues = [Role.Owner, Role.Employee] as const
export const DeviceStatus: SelectOptionType[] =[
    {label: "DeActive", value: "-1"},
    {label: "Normal", value: "0"},
    {label: "Active", value: "1"},
]

export const DeviceTypes: SelectOptionType[] =[
    {label: "FaceID", value: "1"},
    {label: "AParking", value: "0"},
]