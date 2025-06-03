import { Redirect } from "expo-router";
import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H2, Muted } from "@/components/ui/typography";

export default function Homepage() {
	const { initialized, session, signOut } = useAuth();
	const [directSession, setDirectSession] = useState<any>(null);

	useEffect(() => {
		// Check session directly from Supabase
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			console.log("Direct Supabase session check:", !!session);
			setDirectSession(session);
		};
		checkSession();
	}, []);

	console.log(
		"Homepage component - initialized:",
		initialized,
		"session:",
		!!session,
		"directSession:",
		!!directSession,
	);

	if (!initialized) {
		console.log("Homepage: Not initialized, showing loading...");
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text>Loading...</Text>
			</View>
		);
	}

	// Redirect to welcome if not authenticated
	if (!session) {
		console.log("Homepage: No session found, redirecting to welcome...");
		return <Redirect href="/welcome" />;
	}

	console.log("Homepage: Authenticated user found, showing homepage content");

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="flex-1 p-6 gap-y-6">
				{/* Header Section */}
				<View className="items-center gap-y-2 pt-12">
					<H1 className="text-center">Welcome Home!</H1>
					<Muted className="text-center">
						Hello {session.user.email}! You're successfully logged in.
					</Muted>
				</View>

				{/* Main Content */}
				<View className="gap-y-4">
					<H2>Dashboard</H2>
					<View className="bg-card p-4 rounded-lg border border-border">
						<Text className="font-semibold mb-2">Account Information</Text>
						<Muted>Email: {session.user.email}</Muted>
						<Muted>User ID: {session.user.id}</Muted>
						<Muted>
							Last Sign In:{" "}
							{new Date(
								session.user.last_sign_in_at || "",
							).toLocaleDateString()}
						</Muted>
					</View>

					<View className="bg-card p-4 rounded-lg border border-border">
						<Text className="font-semibold mb-2">Quick Actions</Text>
						<Muted className="mb-4">
							Your session is secure and will persist even after closing the
							app.
						</Muted>
						<View className="gap-y-2">
							<Button
								variant="outline"
								size="default"
								onPress={() => {
									console.log("Navigate to profile");
								}}
							>
								<Text>View Profile</Text>
							</Button>
							<Button
								variant="outline"
								size="default"
								onPress={() => {
									console.log("Navigate to features");
								}}
							>
								<Text>Explore Features</Text>
							</Button>
						</View>
					</View>
				</View>

				{/* Sign Out Section */}
				<View className="mt-8 pt-6 border-t border-border">
					<Button
						variant="destructive"
						size="default"
						onPress={handleSignOut}
						className="w-full"
					>
						<Text>Sign Out</Text>
					</Button>
				</View>
			</View>
		</ScrollView>
	);
}
