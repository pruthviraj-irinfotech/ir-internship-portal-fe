export type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  postedDate: string;
  applied?: boolean;
};

export const internships: Internship[] = [
  {
    id: 1,
    title: 'React Js Frontend',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    stipend: '$2,500/month',
    postedDate: '1 day ago',
    applied: true,
  },
  {
    id: 2,
    title: 'NextJs Frontend',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    stipend: '$2,800/month',
    postedDate: '2 days ago',
  },
  {
    id: 3,
    title: 'MERN Stack',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '4 Months',
    stipend: '$3,000/month',
    postedDate: '3 days ago',
  },
  {
    id: 4,
    title: 'Laravel',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    stipend: '$2,500/month',
    postedDate: '4 days ago',
    applied: true,
  },
  {
    id: 5,
    title: 'DevOps',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '6 Months',
    stipend: '$3,500/month',
    postedDate: '5 days ago',
  },
  {
    id: 6,
    title: 'Power Automation',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '2 Months',
    stipend: '$2,000/month',
    postedDate: '6 days ago',
  },
  {
    id: 7,
    title: 'Project Management',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    stipend: '$2,200/month',
    postedDate: '1 week ago',
  },
  {
    id: 8,
    title: 'Machine Learning',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '6 Months',
    stipend: '$4,000/month',
    postedDate: '1 week ago',
  },
  {
    id: 9,
    title: 'UI UX',
    company: 'IR INFOTECH',
    location: 'Remote',
    duration: '3 Months',
    stipend: '$2,500/month',
    postedDate: '8 days ago',
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
