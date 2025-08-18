
'use client';

import type { Internship, Application, InternshipStatus, ApiInternshipStatus } from './mock-data';

const getApiBaseUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        throw new Error('API base URL is not configured.');
    }
    return baseUrl;
};

const getAuthHeaders = (token: string) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
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

export const updateApplicationStatus = async (id: number, status: ApiInternshipStatus, token: string): Promise<Application> => {
    const response = await fetch(`${getApiBaseUrl()}/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update application status');
    }
    return response.json();
};
