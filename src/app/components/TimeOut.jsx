import { useEffect, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function InactivityHandler({ children }) {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (session) {
      let timeout;

      const logoutAfterInactivity = () => {
        clearTimeout(timeout);
        timeout = setTimeout(
          () => {
            signOut(); // Automatically logs out the user
          },
          60 * 60 * 1000
        );
        // 1 hour = 3600000 ms
      };

      // List of events to reset the timer on user activity
      const activityEvents = [
        'mousemove',
        'keydown',
        'click',
        'scroll',
        'touchstart'
      ];

      // Attach event listeners
      activityEvents.forEach(event => {
        window.addEventListener(event, logoutAfterInactivity);
      });

      // Start the timer on first load
      logoutAfterInactivity();

      return () => {
        // Clean up on unmount
        clearTimeout(timeout);
        activityEvents.forEach(event => {
          window.removeEventListener(event, logoutAfterInactivity);
        });
      };
    }
  }, [session]);

  return children;
}
