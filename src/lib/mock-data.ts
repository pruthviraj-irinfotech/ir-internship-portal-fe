
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


export type CertificateStatus = 'Active' | 'Terminated' | 'On Hold';

export type Certificate = {
  id: number;
  applicationId: number;
  certificateNumber: string;
  internName: string;
  internshipRole: string; // Mapped from 'role'
  company: string;
  duration: string; // Mapped from 'internshipDuration'
  approvedDate: string; // Mapped from 'certificateDate'
  description: string;
  imageUrl: string;
  pdfUrl?: string;
  startDate?: string;
  uploadedBy?: number;
  status: CertificateStatus; // Mapped from 'certificateStatus'
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

export type User = {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
    countryCode: string;
    avatarUrl: string;
    qualification: string;
    status: 'student' | 'graduate' | 'professional';
    orgName: string;
    orgCity: string;
    orgState: string;
    orgCountry: string;
    role: 'user' | 'admin';
    password?: string;
};

export const users: User[] = [
    {
        id: 1,
        firstName: 'Player',
        lastName: 'One',
        email: 'player1@email.com',
        phone: '1234567890',
        countryCode: '+91',
        avatarUrl: 'https://placehold.co/100x100.png',
        qualification: 'B.Tech in Computer Science',
        status: 'student',
        orgName: 'University of Example',
        orgCity: 'Exampleville',
        orgState: 'Examplestate',
        orgCountry: 'Exampleland',
        role: 'user',
    },
    {
        id: 2,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@email.com',
        phone: '0987654321',
        countryCode: '+91',
        avatarUrl: 'https://placehold.co/100x100.png',
        qualification: 'M.Tech in Systems Engineering',
        status: 'professional',
        orgName: 'IR INFOTECH',
        orgCity: 'Tech City',
        orgState: 'InfoState',
        orgCountry: 'Stateland',
        role: 'admin',
    },
];

export type Document = {
  id: number;
  name: string;
  url: string;
  uploadedAt: string;
  size: number; // in bytes
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
    comments: string | null;
};


export let applications: Application[] = [];
