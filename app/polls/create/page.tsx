import BackButton from '@/components/shared/back-button';
import CreatePollForm from '@/components/polls/create-poll-form';

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      <BackButton />

      <CreatePollForm />
    </div>
  );
}