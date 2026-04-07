import apiInstance from './apiInstance';

export const getAdminCompanies = async () => {
    const res = await apiInstance.get("/api/admin/companies");
    return res.data;
};
