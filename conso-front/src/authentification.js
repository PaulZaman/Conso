import api_link from "./constants";

async function authenticateUser() {
	try {
		const token = localStorage.getItem("token");
		const user_id = localStorage.getItem("user_id");

		if (token && user_id) {
			const response = await fetch(`${api_link}/auth`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					"id": user_id,
					"token": token
				}),
			});
			if (response.ok) {
				return true; // Authentication successful
			} else {
				return false; // Authentication failed
			}
		} else {
			return false; // Token or user_id not available
		}
	} catch (err) {
		console.error(err.message);
		return false; // Error occurred during authentication
	}
}

export default authenticateUser;
