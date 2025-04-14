import User from '../types/User';

export const updateUserSession = (updatedData: Partial<User>) => {
  const session = sessionStorage.getItem('userSession');
  if (!session) return;

  const parsedSession = JSON.parse(session) as { user: User; expiry: string };

  const updatedUser: User = {
    ...parsedSession.user,
    ...updatedData,
  };

  const updatedSession = {
    ...parsedSession,
    user: updatedUser,
  };

  sessionStorage.setItem('userSession', JSON.stringify(updatedSession));
  localStorage.setItem('userSession', JSON.stringify(updatedSession));
};
