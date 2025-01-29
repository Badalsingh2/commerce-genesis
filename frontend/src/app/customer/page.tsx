//track delivery-- tracking
//dashboard
//  - loyalty points
//    - data analytics
import { auth, currentUser } from '@clerk/nextjs/server';
import UserDashboard from './dashboard';

export default async function Page() {
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  // Get the Backend API User object
  const user = await currentUser();

  return <UserDashboard firstName={user?.firstName} />;
}
