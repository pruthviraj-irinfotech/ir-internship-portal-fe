
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
  // Deprecated fields from old mock data, kept for temporary compatibility
  applied?: boolean; 
  applicationDate?: string;
  status?: InternshipStatus;
};

export let internships: Internship[] = [];


export type CertificateStatus = 'Active' | 'Terminated' | 'On Hold';

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
  {
    id: 2,
    applicationId: 5,
    certificateNumber: 'CERT54321',
    internName: 'Alex Doe',
    internshipRole: 'DevOps',
    company: 'IR INFOTECH',
    duration: '6 Months',
    startDate: '2023-03-01',
    approvedDate: '2023-09-15',
    description: 'Alex Doe completed the DevOps internship, showing great skill in CI/CD, Docker, and cloud infrastructure management. Alex was a proactive and valuable team member.',
    imageUrl: 'https://placehold.co/800x600.png',
    pdfUrl: '#',
    uploadedBy: 2,
    status: 'Active',
  },
  {
    id: 3,
    applicationId: 6,
    certificateNumber: 'CERT67890',
    internName: 'Sam Smith',
    internshipRole: 'MERN Stack',
    company: 'IR INFOTECH',
    duration: '4 Months',
    startDate: '2023-05-15',
    approvedDate: '2023-09-20',
    description: 'Sam Smith has successfully finished the MERN Stack internship. Sam developed a full-stack application, demonstrating proficiency in MongoDB, Express, React, and Node.js.',
    imageUrl: 'https://placehold.co/800x600.png',
    pdfUrl: '#',
    uploadedBy: 2,
    status: 'Active',
  },
  {
    id: 4,
    applicationId: 7,
    certificateNumber: 'ML-TEST-CERT',
    internName: 'Player One',
    internshipRole: 'Machine Learning',
    company: 'IR INFOTECH',
    duration: '6 Months',
    startDate: '2024-01-10',
    approvedDate: '2024-07-15',
    description: 'This is a test certificate to confirm that Player One has successfully completed the Machine Learning internship. Player one showed great promise.',
    imageUrl: 'https://placehold.co/800x600.png',
    pdfUrl: '#',
    uploadedBy: 2,
    status: 'Active',
  },
  {
    id: 5,
    applicationId: 7,
    certificateNumber: 'INT25-099',
    internName: 'Test Intern',
    internshipRole: 'Quality Assurance',
    company: 'IR INFOTECH',
    duration: '2 Months',
    startDate: '2024-05-01',
    approvedDate: '2024-07-01',
    description: 'This is a test certificate for ID `INT25-099` to ensure the verification functionality is working correctly. This intern showed great attention to detail.',
    imageUrl: 'https://placehold.co/800x600.png',
    pdfUrl: '#',
    uploadedBy: 2,
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
     {
        id: 3,
        firstName: 'Alex',
        lastName: 'Doe',
        email: 'alex.doe@email.com',
        phone: '5551234567',
        countryCode: '+1',
        avatarUrl: 'https://placehold.co/100x100.png',
        qualification: 'MBA',
        status: 'professional',
        orgName: 'Business Corp',
        orgCity: 'Metropolis',
        orgState: 'NY',
        orgCountry: 'USA',
        role: 'user',
    },
    {
        id: 4,
        firstName: 'Sam',
        lastName: 'Smith',
        email: 'sam.smith@email.com',
        phone: '555-987-6543',
        countryCode: '+1',
        avatarUrl: 'https://placehold.co/100x100.png',
        qualification: 'B.Sc. in IT',
        status: 'graduate',
        orgName: 'Tech Institute',
        orgCity: 'Innovate City',
        orgState: 'CA',
        orgCountry: 'USA',
        role: 'user',
    }
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
  internshipId: number;
  internshipTitle: string;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  applicationDate: string;
  status: InternshipStatus;
  resumeUrl: string;
  whyApply: string;
  altEmail?: string;
  altPhone?: string;
  qualification: string;
  userStatus: 'student' | 'graduate' | 'professional';
  orgName: string;
  orgCity: string;
  orgState: string;
  orgCountry: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewInstructions?: string;
  comments?: string;
  adminDocuments?: Document[];
  userDocuments?: Document[];
  internId?: number;
  endDate?: string;
  reportingTo?: string;
  workEmail?: string;
  driveLink?: string;
};

export const applications: Application[] = [
    {
        id: 1,
        applicationNumber: "IRAPPL0001",
        internshipId: 1,
        internshipTitle: 'React Js Frontend',
        userId: 1,
        userName: 'Player One',
        userEmail: 'player1@email.com',
        userPhone: '123-456-7890',
        applicationDate: '2024-07-30',
        status: 'In Review',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'I am very passionate about React and have been building projects with it for the past year. I believe I have the skills and enthusiasm to be a great contributor to your team.',
        qualification: 'B.Tech in Computer Science',
        userStatus: 'student',
        orgName: 'University of Example',
        orgCity: 'Exampleville',
        orgState: 'Examplestate',
        orgCountry: 'Exampleland',
        comments: '<p>Good resume, but lacks specific project experience. Keeping in review for now.</p>',
    },
    {
        id: 2,
        applicationNumber: "IRAPPL0002",
        internshipId: 5,
        internshipTitle: 'DevOps',
        userId: 1,
        userName: 'Player One',
        userEmail: 'player1@email.com',
        userPhone: '123-456-7890',
        applicationDate: '2024-07-26',
        status: 'Interview Scheduled',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'My interest in automation and system architecture makes me a strong candidate for this DevOps role. I am eager to learn from your experienced team.',
        qualification: 'B.Tech in Computer Science',
        userStatus: 'student',
        orgName: 'University of Example',
        orgCity: 'Exampleville',
        orgState: 'Examplestate',
        orgCountry: 'Exampleland',
        interviewDate: '2024-08-10',
        interviewTime: '02:00 PM',
        interviewInstructions: '<ul><li>Please join the Google Meet link 5 minutes early.</li><li>Be prepared to discuss your resume and past projects.</li></ul>'
    },
     {
        id: 3,
        applicationNumber: "IRAPPL0003",
        internshipId: 9,
        internshipTitle: 'UI UX',
        userId: 1,
        userName: 'Player One',
        userEmail: 'player1@email.com',
        userPhone: '123-456-7890',
        applicationDate: '2024-07-29',
        status: 'Terminated',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'I have a keen eye for design and a passion for creating intuitive user experiences. My portfolio showcases several projects where I have applied user-centered design principles.',
        qualification: 'B.Tech in Computer Science',
        userStatus: 'student',
        orgName: 'University of Example',
        orgCity: 'Exampleville',
        orgState: 'Examplestate',
        orgCountry: 'Exampleland',
        comments: '<p>The internship was terminated due to not meeting project deadlines and a lack of communication.</p>',
    },
    {
        id: 4,
        applicationNumber: "IRAPPL0004",
        internshipId: 4,
        internshipTitle: 'Laravel',
        userId: 1,
        userName: 'Player One',
        userEmail: 'player1@email.com',
        userPhone: '123-456-7890',
        applicationDate: '2024-07-27',
        status: 'Ongoing',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'I am excited to learn backend development with Laravel and contribute to real-world projects.',
        qualification: 'B.Tech in Computer Science',
        userStatus: 'student',
        orgName: 'University of Example',
        orgCity: 'Exampleville',
        orgState: 'Examplestate',
        orgCountry: 'Exampleland',
        internId: 1,
        endDate: '2024-10-27',
        reportingTo: 'Mr. Smith',
        workEmail: 'p1.work@irinfotech.com',
        adminDocuments: [
            { id: 1, name: 'Project-Brief.pdf', url: '#', uploadedAt: '2024-07-28', size: 262144 },
            { id: 2, name: 'Style-Guide.docx', url: '#', uploadedAt: '2024-07-28', size: 131072 },
        ],
        userDocuments: [
            { id: 101, name: 'Task-1-Submission.zip', url: '#', uploadedAt: '2024-08-02', size: 2097152 },
        ]
    },
    {
        id: 5,
        applicationNumber: "IRAPPL0005",
        internshipId: 2,
        internshipTitle: 'NextJs Frontend',
        userId: 3,
        userName: 'Alex Doe',
        userEmail: 'alex.doe@email.com',
        userPhone: '5551234567',
        applicationDate: '2024-03-01',
        status: 'Completed',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'Completed the Next.js internship successfully. Ready for the next challenge.',
        qualification: 'MBA',
        userStatus: 'professional',
        orgName: 'Business Corp',
        orgCity: 'Metropolis',
        orgState: 'NY',
        orgCountry: 'USA',
        internId: 3,
        endDate: '2024-06-01',
        reportingTo: 'Ms. Jane',
        workEmail: 'alex.work@irinfotech.com',
        driveLink: 'https://docs.google.com/folder/d/123xyz-example-link/view',
    },
    {
        id: 6,
        applicationNumber: "IRAPPL0006",
        internshipId: 3,
        internshipTitle: 'MERN Stack',
        userId: 4, 
        userName: 'Sam Smith',
        userEmail: 'sam.smith@email.com',
        userPhone: '555-987-6543',
        applicationDate: '2024-02-15',
        status: 'Completed',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'Completed the MERN stack internship with flying colors.',
        qualification: 'B.Sc. in IT',
        userStatus: 'graduate',
        orgName: 'Tech Institute',
        orgCity: 'Innovate City',
        orgState: 'CA',
        orgCountry: 'USA',
        internId: 4,
        endDate: '2024-06-15',
        reportingTo: 'Mr. John',
        workEmail: 'sam.work@irinfotech.com',
    },
    {
        id: 7,
        applicationNumber: "IRAPPL0007",
        internshipId: 8,
        internshipTitle: 'Machine Learning',
        userId: 1,
        userName: 'Player One',
        userEmail: 'player1@email.com',
        userPhone: '123-456-7890',
        applicationDate: '2024-01-10',
        status: 'Completed',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'I have a strong background in mathematics and programming, and I am fascinated by the potential of machine learning to solve complex problems. I have completed several online courses and built personal projects in this domain.',
        qualification: 'B.Tech in Computer Science',
        userStatus: 'student',
        orgName: 'University of Example',
        orgCity: 'Exampleville',
        orgState: 'Examplestate',
        orgCountry: 'Exampleland',
        internId: 1,
        endDate: '2024-07-10',
        reportingTo: 'Dr. Eva',
        workEmail: 'ml.work@irinfotech.com',
        driveLink: 'https://docs.google.com/folder/d/some-other-unique-id/view'
    }
];
