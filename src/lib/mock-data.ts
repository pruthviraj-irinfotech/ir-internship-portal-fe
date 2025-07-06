
export type InternshipStatus = 'In Review' | 'Rejected' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Withdrawn' | 'Ongoing' | 'Terminated';

export type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  amount?: number;
  isMonthly?: boolean;
  category: 'Paid' | 'Free' | 'Stipend';
  postedDate: string;
  active?: boolean;
  applied?: boolean;
  applicationDate?: string;
  status?: InternshipStatus;
  description?: string;
  detailedDescription?: string;
  selectionProcess?: string;
  perksAndBenefits?: string;
  whoCanApply?: string;
  announcements?: string;
  adminNotes?: string[];
  assignedDocuments?: { name: string; url: string }[];
};

export const internships: Internship[] = [
  {
    id: 1,
    title: 'React Js Frontend',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    amount: 15000,
    isMonthly: true,
    category: 'Stipend',
    postedDate: '2024-07-29',
    active: true,
    applied: true,
    applicationDate: '2024-07-30',
    status: 'In Review',
    description: 'This internship focuses on building modern, responsive user interfaces using React.js. You will work on real-world projects, learn state management with Redux or Context API, and collaborate with our senior developers.',
    detailedDescription: 'This is a deeper dive into the React Js Frontend internship. You will be a part of our core development team and contribute to our flagship products. This role is perfect for someone who is passionate about building beautiful and performant user interfaces.',
    selectionProcess: '<ul><li>Application Review</li><li>Technical Assessment</li><li>HR Interview</li><li>Final Interview with Team Lead</li></ul>',
    perksAndBenefits: '<ul><li>Certificate of Completion</li><li>Letter of Recommendation</li><li>Flexible work hours</li><li>Mentorship from senior developers</li></ul>',
    whoCanApply: '<ul><li>Available for a duration of 3 months.</li><li>Have relevant skills and interests in front-end development.</li><li>Can start the internship immediately.</li><li>Strong understanding of HTML, CSS, and JavaScript.</li></ul>',
    announcements: '<ul><li>The application deadline has been extended to next week.</li></ul>',
  },
  {
    id: 2,
    title: 'NextJs Frontend',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    amount: 18000,
    isMonthly: true,
    category: 'Stipend',
    postedDate: '2024-07-28',
    active: true,
    applied: true,
    applicationDate: '2024-03-01',
    status: 'Selected',
    description: 'Dive into the world of server-side rendering and static site generation with Next.js. This role involves building high-performance, SEO-friendly web applications and understanding the full-stack capabilities of the Next.js framework.',
    detailedDescription: 'As a Next.js intern, you will build on your React knowledge to create full-stack applications. You will learn about server components, API routes, and advanced routing patterns to build production-grade web apps.',
    selectionProcess: '<ul><li>Application Review</li><li>Portfolio Showcase</li><li>Technical Interview with a focus on Next.js concepts</li><li>Final Interview</li></ul>',
    perksAndBenefits: '<ul><li>Competitive stipend</li><li>Work on cutting-edge technology</li><li>Potential for a full-time offer</li></ul>',
    whoCanApply: '<ul><li>Experience with React is required.</li><li>Familiarity with server-side rendering concepts.</li><li>Available for 3 months.</li></ul>',
  },
  {
    id: 3,
    title: 'MERN Stack',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '4 Months',
    amount: 20000,
    isMonthly: true,
    category: 'Stipend',
    postedDate: '2024-07-27',
    active: true,
    applied: true,
    applicationDate: '2024-02-15',
    status: 'Selected',
    description: 'Become a full-stack developer by mastering the MERN (MongoDB, Express, React, Node.js) stack. You will build and deploy complete web applications, from database design to frontend implementation.',
    detailedDescription: 'This comprehensive MERN stack internship will guide you through building a complete web application from scratch. You will design and implement RESTful APIs, manage databases with MongoDB, and build a dynamic frontend with React.',
    selectionProcess: '<ul><li>Resume Screening</li><li>Coding Challenge (Node.js & React)</li><li>Technical Interview</li><li>Cultural Fit Interview</li></ul>',
    perksAndBenefits: '<ul><li>Certificate of Completion</li><li>Gain full-stack development experience</li><li>Exposure to the entire product lifecycle</li></ul>',
    whoCanApply: '<ul><li>Strong knowledge of JavaScript, including ES6+ features.</li><li>Understanding of both front-end and back-end development.</li><li>Eager to learn and work in a fast-paced environment.</li></ul>',
  },
  {
    id: 4,
    title: 'Laravel',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    amount: 10000,
    isMonthly: false,
    category: 'Paid',
    postedDate: '2024-07-26',
    active: true,
    applied: true,
    applicationDate: '2024-07-27',
    status: 'Ongoing',
    description: 'Learn the fundamentals of backend development with the elegant PHP framework, Laravel. This training-focused internship covers MVC architecture, database migrations, and building robust APIs.',
    adminNotes: [
        'Welcome to the team! Your first assignment is due next Friday.',
        'Please review the project documentation shared in the assigned documents section.',
        'Weekly review meeting is scheduled every Monday at 11:00 AM.'
    ],
    assignedDocuments: [
        { name: 'Project-Brief.pdf', url: '#' },
        { name: 'Style-Guide.docx', url: '#' },
        { name: 'API-Documentation.pdf', url: '#' }
    ]
  },
  {
    id: 5,
    title: 'DevOps',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '6 Months',
    amount: 25000,
    isMonthly: true,
    category: 'Stipend',
    postedDate: '2024-07-25',
    active: true,
    applied: true,
    applicationDate: '2024-07-26',
    status: 'Shortlisted',
    description: 'Explore the culture and practices of DevOps. This internship will give you hands-on experience with CI/CD pipelines, containerization using Docker, and cloud infrastructure management.',
    detailedDescription: 'Join our DevOps team to learn how we build, test, and release software reliably and efficiently. You will work with tools like Jenkins, Docker, Kubernetes, and Ansible to automate our infrastructure and deployment pipelines.',
    selectionProcess: '<ul><li>Aptitude Test</li><li>Technical Interview on Linux and Networking basics</li><li>Interview with the Head of Engineering</li></ul>',
    perksAndBenefits: '<ul><li>High-impact learning opportunity</li><li>Work with a team of experienced DevOps engineers</li><li>Valuable certificate and potential for a full-time role</li></ul>',
    whoCanApply: '<ul><li>A passion for automation and infrastructure.</li><li>Basic understanding of cloud computing (AWS, GCP, or Azure).</li><li>Familiarity with scripting languages like Bash or Python.</li></ul>',
  },
  {
    id: 6,
    title: 'Power Automation',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '2 Months',
    category: 'Free',
    postedDate: '2024-07-24',
    active: false,
    description: 'An introductory internship to Microsoft Power Automate. Learn to create automated workflows between your favorite apps and services to synchronize files, get notifications, and collect data.',
    detailedDescription: 'This is a beginner-friendly internship for those interested in low-code/no-code automation. You will learn to use Microsoft Power Automate to build flows that solve real-world business problems, improving efficiency and productivity.',
    selectionProcess: '<ul><li>Online Application</li><li>Shortlisted candidates will be contacted for a brief online interview.</li></ul>',
    perksAndBenefits: '<ul><li>Certificate of Completion</li><li>Gain a highly marketable skill in business process automation.</li><li>Flexible, self-paced learning environment.</li></ul>',
    whoCanApply: '<ul><li>No prior coding experience is required.</li><li>Must be a logical thinker with an interest in problem-solving.</li><li>Open to students and professionals from all backgrounds.</li></ul>',
  },
  {
    id: 7,
    title: 'Project Management',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    category: 'Free',
    postedDate: '2024-07-23',
    active: true,
    description: 'Gain practical experience in project management methodologies like Agile and Scrum. You will learn to use tools like Jira, create project timelines, and facilitate team collaboration to deliver projects on time.',
    detailedDescription: 'As a Project Management intern, you will support our project managers in planning, executing, and monitoring projects. You will get hands-on experience with project management software and learn how to manage scope, time, and resources effectively.',
    selectionProcess: '<ul><li>Application & Resume screen</li><li>Situational Judgement Test</li><li>Interview with a Senior Project Manager</li></ul>',
    perksAndBenefits: '<ul><li>Certificate of Completion</li><li>Learn from certified Project Management Professionals (PMPs).</li><li>Develop strong organizational and leadership skills.</li></ul>',
    whoCanApply: '<ul><li>Excellent communication and interpersonal skills.</li><li>Strong organizational skills and attention to detail.</li><li>A basic understanding of project management concepts is a plus.</li></ul>',
  },
  {
    id: 8,
    title: 'Machine Learning',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '6 Months',
    amount: 28000,
    isMonthly: true,
    category: 'Stipend',
    postedDate: '2024-07-23',
    active: true,
    applied: true,
    applicationDate: '2024-01-10',
    status: 'Selected',
    description: 'Work on cutting-edge machine learning projects. This internship involves data preprocessing, model training and evaluation, and deploying machine learning models into production environments.',
    detailedDescription: 'This is an advanced internship for students passionate about AI and Machine Learning. You will work on a real-world problem, from data collection and cleaning to model building, evaluation, and deployment. You will be using Python and popular libraries like TensorFlow or PyTorch.',
    selectionProcess: '<ul><li>Technical screening with a focus on algorithms and data structures.</li><li>Machine Learning theory and practical assessment.</li><li>Interview with our AI research team.</li></ul>',
    perksAndBenefits: '<ul><li>Opportunity to contribute to a real-world ML project.</li><li>High-value certificate and strong recommendation letter.</li><li>Guidance from ML experts.</li></ul>',
    whoCanApply: '<ul><li>Strong programming skills in Python.</li><li>Solid understanding of machine learning algorithms.</li><li>Experience with ML libraries like Scikit-learn, TensorFlow, or PyTorch.</li></ul>',
  },
  {
    id: 9,
    title: 'UI UX',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    amount: 8000,
    isMonthly: false,
    category: 'Paid',
    postedDate: '2024-07-22',
    active: true,
    applied: true,
    applicationDate: '2024-07-29',
    status: 'Terminated',
    description: 'A training program focused on the principles of User Interface (UI) and User Experience (UX) design. You will learn to use tools like Figma, create wireframes and prototypes, and conduct user research.',
    detailedDescription: 'This training-based internship is perfect for aspiring designers. You will learn the entire design process, from user research and creating personas to wireframing, prototyping, and usability testing. You will work on a portfolio project under the guidance of our experienced designers.',
    selectionProcess: '<ul><li>Portfolio Review is mandatory.</li><li>Design Task</li><li>Interview with the Design Lead</li></ul>',
    perksAndBenefits: '<ul><li>Build a strong portfolio with a real-world project.</li><li>Certificate of training completion.</li><li>Personalized feedback and mentorship.</li></ul>',
    whoCanApply: '<ul><li>A strong portfolio showcasing your design skills.</li><li>Proficiency in design tools like Figma, Sketch, or Adobe XD.</li><li>A keen eye for detail and a passion for user-centric design.</li></ul>',
  },
];

export type CertificateStatus = 'Active' | 'Terminated' | 'On Hold';

export type Certificate = {
  id: string;
  internName: string;
  internshipRole: string;
  company: string;
  duration: string;
  approvedDate: string;
  description: string;
  imageUrl: string;
  pdfUrl?: string;
  startDate?: string;
  uploadedBy?: string;
  status?: CertificateStatus;
};

export const interns = [
    { id: 'INT24-001', name: 'Player One' },
    { id: 'INT24-002', name: 'Alex Doe' },
    { id: 'INT24-003', name: 'Sam Smith' },
    { id: 'INT24-004', name: 'Jamie Rivera' },
    { id: 'INT24-005', name: 'Casey Jordan' },
];

export const certificates: Certificate[] = [
  {
    id: 'CERT12345',
    internName: 'Player One',
    internshipRole: 'React Js Frontend',
    company: 'IR INFOTECH',
    duration: '3 Months',
    startDate: '2023-06-01',
    approvedDate: '2023-09-05',
    description: 'This certifies that Player One has successfully completed the React Js Frontend internship at IR INFOTECH. During this internship, Player One demonstrated exceptional skills in building modern, responsive web applications using React. Their dedication and creative contributions were invaluable to the team.',
    imageUrl: 'https://placehold.co/800x600.png',
    pdfUrl: '#',
    uploadedBy: 'Admin',
    status: 'Active',
  },
  {
    id: 'CERT54321',
    internName: 'Alex Doe',
    internshipRole: 'DevOps',
    company: 'IR INFOTECH',
    duration: '6 Months',
    startDate: '2023-03-01',
    approvedDate: '2023-09-15',
    description: 'Alex Doe completed the DevOps internship, showing great skill in CI/CD, Docker, and cloud infrastructure management. Alex was a proactive and valuable team member.',
    imageUrl: 'https://placehold.co/800x600.png',
    pdfUrl: '#',
    uploadedBy: 'Admin',
    status: 'Active',
  },
  {
    id: 'CERT67890',
    internName: 'Sam Smith',
    internshipRole: 'MERN Stack',
    company: 'IR INFOTECH',
    duration: '4 Months',
    startDate: '2023-05-15',
    approvedDate: '2023-09-20',
    description: 'Sam Smith has successfully finished the MERN Stack internship. Sam developed a full-stack application, demonstrating proficiency in MongoDB, Express, React, and Node.js.',
    imageUrl: 'https://placehold.co/800x600.png',
    pdfUrl: '#',
    uploadedBy: 'Admin',
    status: 'Active',
  },
];

export type User = {
    id: string;
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
        id: 'usr-001',
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
        id: 'usr-002',
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
        id: 'usr-003',
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
];

export type Document = {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size: number; // in bytes
};

export type Application = {
  id: string;
  internshipId: number;
  internshipTitle: string;
  userId: string;
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
  internId?: string;
  endDate?: string;
  reportingTo?: string;
  workEmail?: string;
  driveLink?: string;
};

export const applications: Application[] = [
    {
        id: 'APP-1669812345',
        internshipId: 1,
        internshipTitle: 'React Js Frontend',
        userId: 'usr-001',
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
        id: 'APP-1669812346',
        internshipId: 5,
        internshipTitle: 'DevOps',
        userId: 'usr-001',
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
        id: 'APP-1669812347',
        internshipId: 9,
        internshipTitle: 'UI UX',
        userId: 'usr-001',
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
        id: 'APP-1669812348',
        internshipId: 4,
        internshipTitle: 'Laravel',
        userId: 'usr-001',
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
        internId: 'INT24-001',
        endDate: '2024-10-27',
        reportingTo: 'Mr. Smith',
        workEmail: 'p1.work@irinfotech.com',
        adminDocuments: [
            { id: 'doc-admin-1', name: 'Project-Brief.pdf', url: '#', uploadedAt: '2024-07-28', size: 262144 },
            { id: 'doc-admin-2', name: 'Style-Guide.docx', url: '#', uploadedAt: '2024-07-28', size: 131072 },
        ],
        userDocuments: [
            { id: 'doc-user-1', name: 'Task-1-Submission.zip', url: '#', uploadedAt: '2024-08-02', size: 2097152 },
        ]
    },
    {
        id: 'APP-1669812349',
        internshipId: 2,
        internshipTitle: 'NextJs Frontend',
        userId: 'usr-003',
        userName: 'Alex Doe',
        userEmail: 'alex.doe@email.com',
        userPhone: '5551234567',
        applicationDate: '2024-03-01',
        status: 'Selected',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'Completed the Next.js internship successfully. Ready for the next challenge.',
        qualification: 'MBA',
        userStatus: 'professional',
        orgName: 'Business Corp',
        orgCity: 'Metropolis',
        orgState: 'NY',
        orgCountry: 'USA',
        internId: 'INT24-002',
        endDate: '2024-06-01',
        reportingTo: 'Ms. Jane',
        workEmail: 'alex.work@irinfotech.com',
        driveLink: 'https://docs.google.com/folder/d/123xyz-example-link/view',
    },
    {
        id: 'APP-1669812350',
        internshipId: 3,
        internshipTitle: 'MERN Stack',
        userId: 'usr-004', 
        userName: 'Sam Smith',
        userEmail: 'sam.smith@email.com',
        userPhone: '555-987-6543',
        applicationDate: '2024-02-15',
        status: 'Selected',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'Completed the MERN stack internship with flying colors.',
        qualification: 'B.Sc. in IT',
        userStatus: 'graduate',
        orgName: 'Tech Institute',
        orgCity: 'Innovate City',
        orgState: 'CA',
        orgCountry: 'USA',
        internId: 'INT24-003',
        endDate: '2024-06-15',
        reportingTo: 'Mr. John',
        workEmail: 'sam.work@irinfotech.com',
    },
    {
        id: 'APP-1669812351',
        internshipId: 8,
        internshipTitle: 'Machine Learning',
        userId: 'usr-001',
        userName: 'Player One',
        userEmail: 'player1@email.com',
        userPhone: '123-456-7890',
        applicationDate: '2024-01-10',
        status: 'Selected',
        resumeUrl: 'https://placehold.co/600x800.png',
        whyApply: 'I have a strong background in mathematics and programming, and I am fascinated by the potential of machine learning to solve complex problems. I have completed several online courses and built personal projects in this domain.',
        qualification: 'B.Tech in Computer Science',
        userStatus: 'student',
        orgName: 'University of Example',
        orgCity: 'Exampleville',
        orgState: 'Examplestate',
        orgCountry: 'Exampleland',
        internId: 'INT24-006',
        endDate: '2024-07-10',
        reportingTo: 'Dr. Eva',
        workEmail: 'ml.work@irinfotech.com',
        driveLink: 'https://docs.google.com/folder/d/some-other-unique-id/view'
    }
];
