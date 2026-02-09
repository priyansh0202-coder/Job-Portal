import apiInstance from './apiInstance';

export const postJob = async (jobPayload) => {
    const res = await apiInstance.post("/api/admin/jobs", jobPayload);
    return res.data;
}

export const getJobs = async () => {
    const res = await apiInstance.get("/api/admin/jobs");
    return res.data;
}

/**
 * Update a job (admin only)
 * @param {number} jobId - Job ID to update
 * @param {object} fields - Fields to update
 * @returns {Promise<object>} Updated job
 */
export const updateJob = async (jobId, fields) => {
    const res = await apiInstance.put(`/api/admin/jobs/${jobId}`, fields);
    return res.data;
}

/**
 * Delete a job (admin only)
 * @param {number} jobId - Job ID to delete
 * @param {boolean} hard - If true, hard delete; otherwise soft delete
 * @returns {Promise<object>} Deleted job
 */
export const deleteJob = async (jobId, hard = false) => {
    const url = hard ? `/api/admin/jobs/${jobId}?hard=true` : `/api/admin/jobs/${jobId}`;
    const res = await apiInstance.delete(url);
    return res.data;
}