

'use client';

import type { Internship, Application, ApiInternshipStatus, DetailedApplication, User, DetailedUser, Certificate, CertificateListItem, DetailedCertificate, Intern, Document as DocType, MyGameApplication } from './mock-data';

const getApiBaseUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        throw new Error('API base URL is not configured.');
    }
    return baseUrl;
};

const getAuthHeaders = (token: string, contentType: 'json' | 'multipart' = 'json') => {
    const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
    };
    if (contentType === 'json') {
        headers['Content-Type'] = 'application/json';
    }
    // For multipart, we do NOT set Content-Type, the browser does it.
    return headers;
};

// ====================================================================
// Internship API Functions
// ====================================================================

export const getInternships = async (token: string): Promise<Internship[]> => {
    const response = await fetch(`${getApiBaseUrl()}/api/internships/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch internships');
    return response.json();
};

export const getInternshipById = async (id: number, token: string): Promise<Internship> => {
    const response = await fetch(`${getApiBaseUrl()}/api/internships/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch internship');
    return response.json();
};

export const createInternship = async (internshipData: Omit<Internship, 'id' | 'company' | 'applicationStatus' | 'applicationDate' | 'status'>, token: string): Promise<Internship> => {
    const response = await fetch(`${getApiBaseUrl()}/api/internships`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ ...internshipData, company: 'IR INFOTECH' }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create internship');
    }
    return response.json();
};

export const updateInternship = async (id: number, internshipData: Partial<Internship>, token: string): Promise<Internship> => {
    const response = await fetch(`${getApiBaseUrl()}/api/internships/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify(internshipData),
    });
    if (!response.ok) {
         const error = await response.json();
        throw new Error(error.message || 'Failed to update internship');
    }
    return response.json();
};

export const deleteInternship = async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/api/internships/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        if (response.status === 409) {
             const error = await response.json();
             throw new Error(error.message || 'Cannot delete. Internship has active applications.');
        }
        throw new Error('Failed to delete internship');
    }
};

// ====================================================================
// Application API Functions
// ====================================================================

export const getApplications = async (token: string, status?: string, search?: string): Promise<Application[]> => {
    const url = new URL(`${getApiBaseUrl()}/api/applications/admin/all`);
    if (status && status !== 'all') {
        url.searchParams.append('status', status);
    }
    if (search) {
        url.searchParams.append('search', search);
    }

    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
};

export const getApplicationDetails = async (id: number, token: string): Promise<DetailedApplication> => {
    const response = await fetch(`${getApiBaseUrl()}/api/applications/admin/details/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch application details');
    }
    const data = await response.json();
    // Prepend base URL to resumeUrl
    if (data.resumeUrl && !data.resumeUrl.startsWith('http')) {
        data.resumeUrl = `${getApiBaseUrl()}${data.resumeUrl}`;
    }
    return data;
};


export const updateApplicationDetails = async (id: number, data: any, token: string): Promise<Application> => {
    const response = await fetch(`${getApiBaseUrl()}/api/applications/admin/update/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update application');
    }
    return response.json();
};

export const deleteManyApplications = async (applicationIds: number[], token: string): Promise<{ message: string; count: number }> => {
    const response = await fetch(`${getApiBaseUrl()}/api/applications/admin/delete-many`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ applicationIds }),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to delete applications');
    }
    return result;
};

export const deleteApplication = async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/api/applications/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.status !== 204 && response.status !== 200) {
        throw new Error('Failed to delete application');
    }
};

export const getInternsByStatus = async (token: string, status: 'Ongoing' | 'Completed' | 'Terminated', search?: string): Promise<Intern[]> => {
    const url = new URL(`${getApiBaseUrl()}/api/applications/admin/interns-by-status`);
    url.searchParams.append('status', status);
    if (search) {
        url.searchParams.append('search', search);
    }
    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`Failed to fetch ${status.toLowerCase()} interns`);
    return response.json();
};

export const getMyGames = async (token: string, filter?: 'Ongoing' | 'Completed' | 'all'): Promise<MyGameApplication[]> => {
    const url = new URL(`${getApiBaseUrl()}/api/applications/my-games`);
    if (filter && filter !== 'all') {
        url.searchParams.append('filter', filter);
    }
    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch your games');
    return response.json();
};


// ====================================================================
// User Management API Functions
// ====================================================================

export const getUsers = async (token: string, search?: string): Promise<User[]> => {
    const url = new URL(`${getApiBaseUrl()}/api/users/admin/all`);
    if (search) {
        url.searchParams.append('search', search);
    }
    const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const getUserById = async (id: number, token: string): Promise<DetailedUser> => {
    const response = await fetch(`${getApiBaseUrl()}/api/users/admin/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user details');
    return response.json();
};

export const createUser = async (userData: any, token: string): Promise<User> => {
    const response = await fetch(`${getApiBaseUrl()}/api/users/admin/create`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(userData),
    });
     const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to create user');
    }
    return result;
};

export const updateUser = async (id: number, userData: any, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${getApiBaseUrl()}/api/users/admin/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify(userData),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
    }
    return result;
};

export const deleteUser = async (id: number, token: string): Promise<User> => {
    const response = await fetch(`${getApiBaseUrl()}/api/users/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();
     if (!response.ok) {
        throw new Error(result.message || 'Failed to delete user');
    }
    return result;
};

// ====================================================================
// Certificate API Functions
// ====================================================================

export const getCertificates = async (token: string, search?: string): Promise<CertificateListItem[]> => {
    const url = new URL(`${getApiBaseUrl()}/api/certificates/admin`);
    if (search) url.searchParams.append('search', search);
    const response = await fetch(url.toString(), { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error('Failed to fetch certificates');
    return response.json();
};

export const getCertificateById = async (id: number, token: string): Promise<DetailedCertificate> => {
    const response = await fetch(`${getApiBaseUrl()}/api/certificates/admin/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch certificate details');
    return response.json();
};

export const getEligibleApplications = async (token: string): Promise<{ value: number; label: string; userId: number }[]> => {
    const response = await fetch(`${getApiBaseUrl()}/api/applications/eligible-for-certificate`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch eligible applications');
    return response.json();
};

export const getAllApplicationsForDropdown = async (token: string): Promise<{ value: number; label: string }[]> => {
    const response = await fetch(`${getApiBaseUrl()}/api/applications/all-for-dropdown`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch applications for dropdown');
    return response.json();
};

export const createCertificate = async (formData: FormData, token: string): Promise<Certificate> => {
    const response = await fetch(`${getApiBaseUrl()}/api/certificates/admin`, {
        method: 'POST',
        headers: getAuthHeaders(token, 'multipart'),
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create certificate');
    return result;
};

export const updateCertificate = async (id: number, formData: FormData, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${getApiBaseUrl()}/api/certificates/admin/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token, 'multipart'),
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update certificate');
    return result;
};

export const deleteCertificate = async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/api/certificates/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error('Failed to delete certificate');
    }
};


// ====================================================================
// Document API Functions
// ====================================================================

export const uploadDocument = async (applicationId: number, file: File, token: string): Promise<DocType> => {
    const formData = new FormData();
    formData.append('document', file);
    const response = await fetch(`${getApiBaseUrl()}/api/documents/application/${applicationId}`, {
        method: 'POST',
        headers: getAuthHeaders(token, 'multipart'),
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload document');
    }
    return response.json();
};

export const deleteDocument = async (documentId: number, token: string): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.status !== 204 && response.status !== 200) {
        throw new Error('Failed to delete document');
    }
};
