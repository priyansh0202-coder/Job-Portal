import apiInstance from "./apiInstance";

export const applyJob = async (jobId, formData) => {
    const res = await apiInstance.post(`/api/user/apply/${jobId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const getApplyStatus = async (jobId) => {
    const res = await apiInstance.get(`/api/user/apply/${jobId}/status`);
    return res.data;
};

export const getUserApplications = async () => {
    const res = await apiInstance.get("/api/user/my-applications");
    return res.data;
};
