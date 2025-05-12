import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: {
          Allow: "POST",
          "Content-Type": "application/json",
        },
      });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized: No valid token provided", {
        status: 401,
      });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      const firebaseConfig = {
        apiKey: env.FIREBASE_API_KEY,
        authDomain: env.FIREBASE_AUTH_DOMAIN,
        projectId: env.FIREBASE_PROJECT_ID,
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      await signInWithCustomToken(auth, token);

      // If authentication successful, proceed
      const contentType = request.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        return new Response("Content-Type must be application/json", {
          status: 415,
          headers: { "Content-Type": "application/json" },
        });
      }

      const messages = (await request.json()) as {
        messages?: any[];
        stream: boolean;
      };
      const stream = await env.AI.run("@cf/google/gemma-3-12b-it", {
        messages,
        stream: messages.stream,
        max_tokens: 1096,
      });
      if (messages.stream) {
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      } else {
        const result = await stream;
        return new Response(JSON.stringify(result), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : String(error);

      if (errorMessage.includes("auth") || errorMessage.includes("token")) {
        return new Response("Authentication failed: " + errorMessage, {
          status: 403,
        });
      } else {
        return new Response("Error processing request: " + errorMessage, {
          status: 500,
        });
      }
    }
  },
} satisfies ExportedHandler<Env>;
