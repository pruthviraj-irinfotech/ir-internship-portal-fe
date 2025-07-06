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
