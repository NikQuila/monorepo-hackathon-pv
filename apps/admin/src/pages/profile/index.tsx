import { signOut } from '@common/api/auth';
import { Button } from '@common/components/ui/button';

const ProfilePage = () => {
  return (
    <div>
      <Button onClick={signOut}>Sign out</Button>
    </div>
  );
};

export default ProfilePage;
