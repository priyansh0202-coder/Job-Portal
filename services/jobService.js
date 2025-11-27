import apiInstance from './apiInstance';

export const postJob = async (jobPayload) => {
    const res = await apiInstance.post("/api/admin/jobs", jobPayload);
    return res.data;
}

export const getJobs = async () => {
    const res = await apiInstance.get("/api/admin/jobs");
    return res.data;
}