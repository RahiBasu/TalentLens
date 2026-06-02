export const syncUser = async (clerkId: string, email: string, name: string) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId, email, name }),
    });
  } catch (err) {
    console.error('Failed to sync user:', err);
  }
};