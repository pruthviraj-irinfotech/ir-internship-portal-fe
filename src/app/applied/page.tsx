import { InternshipCard } from '@/components/internship-card';
import { internships } from '@/lib/mock-data';

export default function AppliedInternshipsPage() {
  const appliedInternships = internships.filter(internship => internship.applied);

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="text-center my-8 md:my-16">
        <h1 className="text-3xl md:text-5xl font-headline text-primary">Applied Internships</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">Tracking your career quests.</p>
      </header>

      <section>
        {appliedInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border">
            <p className="text-muted-foreground">You haven't applied to any internships yet.</p>
            <p className="text-xs mt-2">Time to start your adventure!</p>
          </div>
        )}
      </section>
    </div>
  );
}
