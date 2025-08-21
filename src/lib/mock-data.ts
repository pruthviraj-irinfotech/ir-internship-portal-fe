

export type InternshipStatus = 'In Review' | 'Rejected' | 'Shortlisted' | 'Interview Scheduled' | 'Completed' | 'Withdrawn' | 'Ongoing' | 'Terminated';
export type ApiInternshipStatus = "In_Review" | "Ongoing" | "Completed" | "Terminated" | "Rejected" | "Withdrawn" | "Shortlisted" | "Interview_Scheduled";


export type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  amount?: string;
  isMonthly?: boolean;
  category: 'Paid' | 'Free' | 'Stipend';
  postedDate: string;
  isActive: boolean;
  description?: string;
  detailedDescription?: string;
  selectionProcess?: string;
  perksAndBenefits?: string;
  whoCanApply?: string;
  announcements?: string;
  applicationStatus?: ApiInternshipStatus | null;
  applicationDate?: string;
  status?: InternshipStatus; // This is for frontend display mapping, API will use applicationStatus
};

export type CertificateStatus = 'Active' | 'Terminated' | 'On_Hold';

// For the public verification page
export type Certificate = {
  id: number;
  applicationId: number;
  certificateNumber: string;
  internName: string;
  internshipRole: string;
  company: string;
  duration: string;
  approvedDate: string;
  description: string;
  imageUrl: string;
  pdfUrl?: string;
  startDate?: string;
  uploadedBy?: number;
  status: CertificateStatus;
};

// For the main admin list view
export type CertificateListItem = {
    certificate_id: number;
    certificate_number: string;
    intern_name: string;
    role: string;
    date_approved: string;
    status: CertificateStatus;
    pdf_url: string;
    image_url: string;
};

// For the detailed admin view/edit page
export type DetailedCertificate = {
    certificateId: string;
    applicationId: number;
    applicationNumber: string;
    imageUrl: string | null;
    pdfUrl: string | null;
    description: string | null;
    certificateStatus: CertificateStatus;
    uploaded_by_id: number | null;
    internshipStartDate: string | null;
    certificateIssueDate: string | null;
    intern_details: {
        name: string;
        role: string;
    } | null;
};

// For the main admin user list
export type User = {
    id: number;
    avatarUrl: string | null;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
};


// For the detailed user view/edit page
export type DetailedUser = {
  id: number;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  profile: {
    id: number;
    userId: number;
    firstName: string;
    lastName: string | null;
    phone: string;
    countryCode: string;
    avatarUrl: string | null;
  };
  education: {
    id: number;
    userId: number;
    qualification: string;
    currentStatus: 'student' | 'graduate' | 'professional';
    orgName: string;
    orgCity: string;
    orgState: string;
    orgCountry: string;
    isCurrent: boolean;
  }[];
};

export type Document = {
  id: number;
  name: string;
  url: string;
  uploadedAt: string;
  sizeBytes: number;
};

export type Application = {
  id: number;
  applicationNumber: string;
  applicantName: string;
  internshipTitle: string;
  appliedDate: string;
  status: ApiInternshipStatus;
};

export type DetailedApplication = {
    id: number;
    title?: string;
    applicantName?: string;
    applicantPhone?: string;
    applicantEmail?: string;
    resumeUrl?: string;
    applicationId?: string; // This is the applicationNumber
    applicationDate?: string;
    whyApply?: string;
    highestQualification?: string;
    currentStatus?: 'student' | 'graduate' | 'professional';
    organization?: string;
    city?: string;
    state?: string;
    country?: string;
    alternativeEmail?: string | null;
    alternativePhone?: string | null;
    currentApplicationStatus?: ApiInternshipStatus;
    interviewDetails?: {
        date: string | null;
        instructions: string | null;
    };
    comments?: string | null;
    // Fields for ongoing/completed admin pages
    pageTitle?: string;
    managingInternName?: string;
    internId?: string; // Changed from companyInternId
    workEmail?: string | null;
    reportingTo?: string | null;
    internshipEndDate?: string | null;
    driveLink?: string | null;
    documentsForIntern?: Document[];
    documentsFromIntern?: Document[];
    internInfo?: {
        internName: string;
        emailId: string;
        phoneNumber: string;
        internshipStartDate: string;
        role: string;
        duration: string;
    }
};

export type UserApplicationDetails = {
    id: number;
    applicationNumber: string;
    applicationDate: string;
    status: ApiInternshipStatus;
    resumeUrl: string;
    whyApply: string;
    altEmail: string | null;
    altPhone: string | null;
    interviewDate: string | null;
    interviewInstructions: string | null;
    adminComments: string | null;
    internship: {
        title: string;
        company: string;
    };
    user: {
        profile: {
            firstName: string;
            lastName: string | null;
        }
    };
    documents: Document[];
};

export type ApplicationDetails = {
  id: number;
  internship: {
    title: string;
  };
  applicationDate: string;
  endDate?: string;
  userName: string;
  reportingTo?: string;
  adminDocuments?: Document[];
  userDocuments?: Document[];
  userEmail?: string;
  userPhone?: string;
  workEmail?: string;
  driveLink?: string;
};

export type Intern = {
    id: number;
    internName: string;
    internshipRole: string;
    email: string;
    phone: string;
}

export type MyGameApplication = {
    id: number;
    applicationNumber: string;
    internshipId: number;
    userId: number;
    applicationDate: string;
    status: 'Ongoing' | 'Completed';
    internship: Internship;
};

export type MyApplication = {
    id: number;
    applicationNumber: string;
    internshipId: number;
    userId: number;
    applicationDate: string;
    status: ApiInternshipStatus;
    internship: Internship;
}
