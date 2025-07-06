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
  detailedDescription?: string;
  selectionProcess?: string[];
  perksAndBenefits?: string[];
  whoCanApply?: string[];
  announcements?: string[];
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
    detailedDescription: 'This is a deeper dive into the React Js Frontend internship. You will be a part of our core development team and contribute to our flagship products. This role is perfect for someone who is passionate about building beautiful and performant user interfaces.',
    selectionProcess: [
      'Application Review',
      'Technical Assessment',
      'HR Interview',
      'Final Interview with Team Lead',
    ],
    perksAndBenefits: [
      'Certificate of Completion',
      'Letter of Recommendation',
      'Flexible work hours',
      'Mentorship from senior developers',
    ],
    whoCanApply: [
      'Available for a duration of 3 months.',
      'Have relevant skills and interests in front-end development.',
      'Can start the internship immediately.',
      'Strong understanding of HTML, CSS, and JavaScript.',
    ],
    announcements: [
        'The application deadline has been extended to next week.'
    ]
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
    detailedDescription: 'As a Next.js intern, you will build on your React knowledge to create full-stack applications. You will learn about server components, API routes, and advanced routing patterns to build production-grade web apps.',
    selectionProcess: [
      'Application Review',
      'Portfolio Showcase',
      'Technical Interview with a focus on Next.js concepts',
      'Final Interview',
    ],
    perksAndBenefits: [
      'Competitive stipend',
      'Work on cutting-edge technology',
      'Potential for a full-time offer',
    ],
    whoCanApply: [
      'Experience with React is required.',
      'Familiarity with server-side rendering concepts.',
      'Available for 3 months.',
    ],
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
    detailedDescription: 'This comprehensive MERN stack internship will guide you through building a complete web application from scratch. You will design and implement RESTful APIs, manage databases with MongoDB, and build a dynamic frontend with React.',
    selectionProcess: [
      'Resume Screening',
      'Coding Challenge (Node.js & React)',
      'Technical Interview',
      'Cultural Fit Interview',
    ],
    perksAndBenefits: [
      'Certificate of Completion',
      'Gain full-stack development experience',
      'Exposure to the entire product lifecycle',
    ],
    whoCanApply: [
      'Strong knowledge of JavaScript, including ES6+ features.',
      'Understanding of both front-end and back-end development.',
      'Eager to learn and work in a fast-paced environment.',
    ],
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
    detailedDescription: 'Join our DevOps team to learn how we build, test, and release software reliably and efficiently. You will work with tools like Jenkins, Docker, Kubernetes, and Ansible to automate our infrastructure and deployment pipelines.',
    selectionProcess: [
      'Aptitude Test',
      'Technical Interview on Linux and Networking basics',
      'Interview with the Head of Engineering',
    ],
    perksAndBenefits: [
      'High-impact learning opportunity',
      'Work with a team of experienced DevOps engineers',
      'Valuable certificate and potential for a full-time role',
    ],
    whoCanApply: [
      'A passion for automation and infrastructure.',
      'Basic understanding of cloud computing (AWS, GCP, or Azure).',
      'Familiarity with scripting languages like Bash or Python.',
    ],
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
    detailedDescription: 'This is a beginner-friendly internship for those interested in low-code/no-code automation. You will learn to use Microsoft Power Automate to build flows that solve real-world business problems, improving efficiency and productivity.',
    selectionProcess: [
      'Online Application',
      'Shortlisted candidates will be contacted for a brief online interview.',
    ],
    perksAndBenefits: [
      'Certificate of Completion',
      'Gain a highly marketable skill in business process automation.',
      'Flexible, self-paced learning environment.',
    ],
    whoCanApply: [
      'No prior coding experience is required.',
      'Must be a logical thinker with an interest in problem-solving.',
      'Open to students and professionals from all backgrounds.',
    ],
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
    detailedDescription: 'As a Project Management intern, you will support our project managers in planning, executing, and monitoring projects. You will get hands-on experience with project management software and learn how to manage scope, time, and resources effectively.',
    selectionProcess: [
      'Application & Resume screen',
      'Situational Judgement Test',
      'Interview with a Senior Project Manager',
    ],
    perksAndBenefits: [
      'Certificate of Completion',
      'Learn from certified Project Management Professionals (PMPs).',
      'Develop strong organizational and leadership skills.',
    ],
    whoCanApply: [
      'Excellent communication and interpersonal skills.',
      'Strong organizational skills and attention to detail.',
      'A basic understanding of project management concepts is a plus.',
    ],
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
    detailedDescription: 'This is an advanced internship for students passionate about AI and Machine Learning. You will work on a real-world problem, from data collection and cleaning to model building, evaluation, and deployment. You will be using Python and popular libraries like TensorFlow or PyTorch.',
    selectionProcess: [
      'Technical screening with a focus on algorithms and data structures.',
      'Machine Learning theory and practical assessment.',
      'Interview with our AI research team.',
    ],
    perksAndBenefits: [
      'Opportunity to contribute to a real-world ML project.',
      'High-value certificate and strong recommendation letter.',
      'Guidance from ML experts.',
    ],
    whoCanApply: [
      'Strong programming skills in Python.',
      'Solid understanding of machine learning algorithms.',
      'Experience with ML libraries like Scikit-learn, TensorFlow, or PyTorch.',
    ],
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
    detailedDescription: 'This training-based internship is perfect for aspiring designers. You will learn the entire design process, from user research and creating personas to wireframing, prototyping, and usability testing. You will work on a portfolio project under the guidance of our experienced designers.',
    selectionProcess: [
      'Portfolio Review is mandatory.',
      'Design Task',
      'Interview with the Design Lead',
    ],
    perksAndBenefits: [
      'Build a strong portfolio with a real-world project.',
      'Certificate of training completion.',
      'Personalized feedback and mentorship.',
    ],
    whoCanApply: [
      'A strong portfolio showcasing your design skills.',
      'Proficiency in design tools like Figma, Sketch, or Adobe XD.',
      'A keen eye for detail and a passion for user-centric design.',
    ],
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
  pdfUrl?: string;
  startDate?: string;
  uploadedBy?: string;
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
  },
];
