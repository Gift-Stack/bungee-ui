export function validateEnv() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SOCKET_API_KEY",
    "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID",
  ] as const;

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}
