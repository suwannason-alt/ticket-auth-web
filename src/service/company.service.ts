import authenticated from '@/lib/axios/authenticate';
import Cookies from 'js-cookie';
import { Company } from '../service/company.interface';

export async function company() {
    try {
        const instance = await authenticated()
        const response = await instance.get(`/api/v1/company`)
        return response.data;
    } catch (error: any) {
        return error.response || error.message
    }
}

export async function createCompany(companyData: Company) {
    try {
        const instance = await authenticated()
        const response = await instance.post(`/api/v1/company`, companyData)

        Cookies.set('token', response.data.data.token)
        Cookies.set('refreshToken', response.data.data.refreshToken)

        return response.data;
    } catch (error: any) {
        return error.response || error.message
    }
}

export async function switchCompany(company: string) {
    try {
        const instance = await authenticated()
        const response = await instance.patch(`/api/v1/company/switch-company/${company}`)

        Cookies.set('token', response.data.data.token)
        Cookies.set('refreshToken', response.data.data.refreshToken)

        return response.data;
    } catch (error: any) {
        return error.response || error.message
    }
}