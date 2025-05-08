import CenterContainer from '@/components/shared/center-container';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <CenterContainer>
      <SignIn />
    </CenterContainer>
  );
}
