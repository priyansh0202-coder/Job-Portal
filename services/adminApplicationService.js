import apiInstance from "./apiInstance";
 
export const getAdminApplications = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.limit) params.set("limit", filters.limit);
    if (filters.offset !== undefined) params.set("offset", filters.offset);
    if (filters.status) params.set("status", filters.status);
    if (filters.job_id) params.set("job_id", filters.job_id);
    if (filters.user_id) params.set("user_id", filters.user_id);
    if (filters.search) params.set("search", filters.search);

    const res = await apiInstance.get(`/api/admin/applications?${params}`);
    return res.data;
};

export const getAdminApplicationDetail = async (applicationId) => {
    const res = await apiInstance.get(`/api/admin/applications/${applicationId}`);
    return res.data;
};

export const updateApplicationStatus = async (applicationId, status, adminNotes = null, interviewDate = null) => {
    const body = { status };
    if (adminNotes !== null) body.admin_notes = adminNotes;
    if (interviewDate !== null) body.interview_date = interviewDate;
    const res = await apiInstance.patch(`/api/admin/applications/${applicationId}/status`, body);
    return res.data;
};
