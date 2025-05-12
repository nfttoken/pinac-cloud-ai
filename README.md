<div align="center">

<h1 style="border-bottom: none">
    <b>PINAC Nexus</b>
</h1>

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/text-to-image-template)

<br>

</div>

## Features

- **Firebase Authentication**: Only authenticated users with a valid Firebase token can access the API.
- **Streaming & Non-Streaming**: Supports both streaming and standard JSON responses.
- **Cloudflare Workers**: Fast, scalable, and serverless deployment.

## API Usage

### Endpoint

```
POST / (Cloudflare Worker endpoint)
```

### Request Headers

- `Authorization: Bearer <FIREBASE_CUSTOM_TOKEN>`
- `Content-Type: application/json`

### Request Body

```json
{
  "messages": [
    // Array of message objects for the AI model
  ],
  "stream": true // or false
}
```

### Responses

- **200 OK**: Returns AI model response (streaming or JSON).
- **401 Unauthorized**: Missing or invalid Firebase token.
- **403 Forbidden**: Authentication failed.
- **415 Unsupported Media Type**: Content-Type is not `application/json`.
- **405 Method Not Allowed**: Only POST requests are accepted.
- **500 Internal Server Error**: Other errors.

## Example cURL Request

```bash
curl -X POST https://<your-worker-endpoint> \
  -H "Authorization: Bearer <FIREBASE_CUSTOM_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}],"stream":false}'
```

## Setup & Deployment

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/pinac-nexus.git
   cd pinac-nexus
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Add your Firebase credentials to your `wrangler.toml` or Cloudflare dashboard:

   ```toml
   [vars]
   FIREBASE_API_KEY = "your-firebase-api-key"
   FIREBASE_AUTH_DOMAIN = "your-firebase-auth-domain"
   FIREBASE_PROJECT_ID = "your-firebase-project-id"
   ```

4. **Deploy to Cloudflare Workers:**
   ```bash
   npx wrangler deploy
   ```

## Environment Variables

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`

## Notes

- You must provide a valid Firebase custom token in the `Authorization` header for every request.
- The API is designed for secure, authenticated access to AI-powered endpoints.

---

**License:** MIT  
**Author:** [Your Name or Organization]
