import React, { createContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const { data: session } = useSession();

	const getUser = useCallback(async () => {
		try {
			// Fetch user data based on email
			const res = await fetch("http://localhost:3000/api/fetchUser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: session.user.email }),
			});
			const fetchedUser = await res.json();
			setUser(fetchedUser);
		} catch (error) {
			console.error(error);
		}
	}, [session]);

	useEffect(() => {
		// Call getUser when session changes
		if (session && session.user && session.user.email) {
			getUser(session.user.email);
		}
	}, [session, getUser]);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};
