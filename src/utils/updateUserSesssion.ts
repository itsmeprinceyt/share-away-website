// utils/updateUserSession.ts
import User from '../types/User'; // Import your User type

export const updateUserSession = (updatedData: Partial<User>) => {
  const session = sessionStorage.getItem('userSession');
  if (!session) return;

  const { user }: { user: User } = JSON.parse(session); // Type the parsed session

  // Merge the updated data with the current user session
  const updatedUser: User = { ...user, ...updatedData };

  // Save the updated session back to sessionStorage
  sessionStorage.setItem('userSession', JSON.stringify({ user: updatedUser }));
};
