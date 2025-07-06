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
    title: 'Pixel Art Designer',
    company: 'Retro Studios',
    location: 'Remote',
    duration: '3 Months',
    stipend: '$2,000/month',
    postedDate: '2 days ago',
    applied: true,
  },
  {
    id: 2,
    title: 'Frontend Developer (React)',
    company: 'Nintensoft',
    location: 'San Francisco, CA',
    duration: '6 Months',
    stipend: '$3,500/month',
    postedDate: '5 days ago',
  },
  {
    id: 3,
    title: 'Game Dev Intern (Unity)',
    company: 'Atari Games',
    location: 'Austin, TX',
    duration: '4 Months',
    stipend: 'Performance-based',
    postedDate: '1 week ago',
  },
  {
    id: 4,
    title: 'Chiptune Music Composer',
    company: '8-Bit Soundscapes',
    location: 'Remote',
    duration: '2 Months',
    stipend: '$1,500/month',
    postedDate: '1 week ago',
    applied: true,
  },
  {
    id: 5,
    title: 'Backend Engineer (Node.js)',
    company: 'Sega Systems',
    location: 'New York, NY',
    duration: '3 Months',
    stipend: '$3,000/month',
    postedDate: '10 days ago',
  },
  {
    id: 6,
    title: 'QA Tester',
    company: 'Arcade Interactive',
    location: 'Remote',
    duration: '1 Month',
    stipend: '$1,200/month',
    postedDate: '2 weeks ago',
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
    internshipRole: 'Pixel Art Designer',
    company: 'Retro Studios',
    duration: '3 Months (2023-06-01 to 2023-08-31)',
    approvedDate: '2023-09-05',
    description: 'This certifies that Player One has successfully completed the Pixel Art Designer internship at Retro Studios. During this internship, Player One demonstrated exceptional skills in creating 8-bit and 16-bit style assets, character sprites, and environmental tilesets for various game projects. Their dedication and creative contributions were invaluable to the team.',
    imageUrl: 'https://placehold.co/800x600.png',
  },
];
