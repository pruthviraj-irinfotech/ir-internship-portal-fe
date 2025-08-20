

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

export let internships: Internship[] = [];


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



export const interns = [
    { id: 1, name: 'Player One' },
    { id: 2, name: 'Admin User' },
    { id: 3, name: 'Alex Doe' },
    { id: 4, name: 'Sam Smith' },
    { id: 5, name: 'Jamie Rivera' },
    { id: 6, name: 'Casey Jordan' },
];

export const certificates: Certificate[] = [
  {
    id: 1,
    applicationId: 5, // Corresponds to Alex Doe's completed NextJS internship
    certificateNumber: 'CERT12345',
    internName: 'Player One',
    internshipRole: 'React Js Frontend',
    company: 'IR INFOTECH',
    duration: '3 Months',
    startDate: '2023-06-01',
    approvedDate: '2023-09-05',
    description: 'This certifies that Player One has successfully completed the React Js Frontend internship at IR INFOTECH. During this internship, Player One demonstrated exceptional skills in building modern, responsive web applications using React. Their dedication and creative contributions were invaluable to the team.',
    imageUrl: 'https://placehold.co/800x600.png',
    pdfUrl: '#',
    uploadedBy: 2, // Admin User
    status: 'Active',
  },
];

// For the main admin user list
export type User = {
    id: number;
    avatarUrl: string | null;
    name: string;
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


export const users: User[] = [];

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
    title: string;
    applicantName: string;
    applicantPhone: string;
    applicantEmail: string;
    resumeUrl: string;
    applicationId: string; // This is the applicationNumber
    applicationDate: string;
    whyApply: string;
    highestQualification: string;
    currentStatus: 'student' | 'graduate' | 'professional';
    organization: string;
    city: string;
    state: string;
    country: string;
    alternativeEmail: string | null;
    alternativePhone: string | null;
    currentApplicationStatus: ApiInternshipStatus;
    interviewDetails: {
        date: string | null;
        instructions: string | null;
    };
    adminComments: string | null;
    // New fields for completed/terminated pages
    workEmail?: string | null;
    companyInternId?: string | null;
    reportingTo?: string | null;
    internshipEndDate?: string | null;
    driveLink?: string | null;

    // fields for ongoing intern details page
    pageTitle?: string;
    managingInternName?: string;
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


export let applications: Application[] = [];

    