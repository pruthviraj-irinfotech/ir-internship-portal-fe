export type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  amount: string;
  category: 'Paid' | 'Free' | 'Stipend';
  postedDate: string;
  applied?: boolean;
  applicationDate?: string;
  status?: 'In Review' | 'Shortlisted' | 'Not Selected' | 'Ongoing';
  description?: string;
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
    amount: '15,000/month',
    category: 'Stipend',
    postedDate: '1 day ago',
    applied: true,
    applicationDate: '1 day ago',
    status: 'In Review',
    description: 'This internship focuses on building modern, responsive user interfaces using React.js. You will work on real-world projects, learn state management with Redux or Context API, and collaborate with our senior developers.',
  },
  {
    id: 2,
    title: 'NextJs Frontend',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    amount: '18,000/month',
    category: 'Stipend',
    postedDate: '2 days ago',
    description: 'Dive into the world of server-side rendering and static site generation with Next.js. This role involves building high-performance, SEO-friendly web applications and understanding the full-stack capabilities of the Next.js framework.',
  },
  {
    id: 3,
    title: 'MERN Stack',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '4 Months',
    amount: '20,000/month',
    category: 'Stipend',
    postedDate: '3 days ago',
    description: 'Become a full-stack developer by mastering the MERN (MongoDB, Express, React, Node.js) stack. You will build and deploy complete web applications, from database design to frontend implementation.',
  },
  {
    id: 4,
    title: 'Laravel',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    amount: '10,000',
    category: 'Paid',
    postedDate: '4 days ago',
    applied: true,
    applicationDate: '4 days ago',
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
    amount: '25,000/month',
    category: 'Stipend',
    postedDate: '5 days ago',
    applied: true,
    applicationDate: '5 days ago',
    status: 'Shortlisted',
    description: 'Explore the culture and practices of DevOps. This internship will give you hands-on experience with CI/CD pipelines, containerization using Docker, and cloud infrastructure management.',
  },
  {
    id: 6,
    title: 'Power Automation',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '2 Months',
    amount: 'N/A',
    category: 'Free',
    postedDate: '6 days ago',
    description: 'An introductory internship to Microsoft Power Automate. Learn to create automated workflows between your favorite apps and services to synchronize files, get notifications, and collect data.',
  },
  {
    id: 7,
    title: 'Project Management',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    amount: 'N/A',
    category: 'Free',
    postedDate: '1 week ago',
    description: 'Gain practical experience in project management methodologies like Agile and Scrum. You will learn to use tools like Jira, create project timelines, and facilitate team collaboration to deliver projects on time.',
  },
  {
    id: 8,
    title: 'Machine Learning',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '6 Months',
    amount: '28,000/month',
    category: 'Stipend',
    postedDate: '1 week ago',
    description: 'Work on cutting-edge machine learning projects. This internship involves data preprocessing, model training and evaluation, and deploying machine learning models into production environments.',
  },
  {
    id: 9,
    title: 'UI UX',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    amount: '8,000',
    category: 'Paid',
    postedDate: '8 days ago',
    applied: true,
    applicationDate: '2 days ago',
    status: 'Not Selected',
    description: 'A training program focused on the principles of User Interface (UI) and User Experience (UX) design. You will learn to use tools like Figma, create wireframes and prototypes, and conduct user research.',
  },
];

export type Certificate = {
  id: string;
  internName: string;
  internshipRole: string;
  company: string;
  duration: string;
  approvedDate: string;
  description: string;
  imageUrl: string;
};

export const certificates: Certificate[] = [
  {
    id: 'CERT12345',
    internName: 'Player One',
    internshipRole: 'React Js Frontend',
    company: 'IR INFOTECH',
    duration: '3 Months (2023-06-01 to 2023-08-31)',
    approvedDate: '2023-09-05',
    description: 'This certifies that Player One has successfully completed the React Js Frontend internship at IR INFOTECH. During this internship, Player One demonstrated exceptional skills in building modern, responsive web applications using React. Their dedication and creative contributions were invaluable to the team.',
    imageUrl: 'https://placehold.co/800x600.png',
  },
];
