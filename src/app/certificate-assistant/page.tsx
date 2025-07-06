'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateCertificateAction, FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Generate Description'}
    </Button>
  );
}

export default function CertificateAssistantPage() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useFormState(generateCertificateAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === 'success') {
      toast({
        title: 'Description Generated!',
        description: 'Your certificate description is ready.',
      });
    } else if (state.message && state.message !== 'success') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const handleReset = () => {
    formRef.current?.reset();
    state.message = '';
    state.description = '';
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">AI Certificate Assistant</CardTitle>
          <CardDescription>Generate a professional certificate description instantly.</CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="internName">Intern Name</Label>
                <Input name="internName" id="internName" placeholder="Player One" defaultValue={state.fields?.internName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internshipRole">Internship Role</Label>
                <Input name="internshipRole" id="internshipRole" placeholder="Pixel Art Designer" defaultValue={state.fields?.internshipRole}/>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input name="startDate" id="startDate" type="date" defaultValue={state.fields?.startDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input name="endDate" id="endDate" type="date" defaultValue={state.fields?.endDate} />
              </div>
            </div>
            {state.description && (
                <div className="space-y-2 pt-4">
                    <Label>Generated Description</Label>
                    <Textarea readOnly value={state.description} rows={5} className="bg-background/50" />
                </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
             <SubmitButton />
             {state.description && <Button variant="secondary" onClick={handleReset} className="w-full sm:w-auto">Start Over</Button>}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
