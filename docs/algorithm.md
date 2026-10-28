# anon-confessions Algorithm

1. Project Setup

- Frontend: React (Vite) for the web form
- Backend: Node.js + Express
- Dependencies: axios (Telegram API), crypto (Proof-of-Work), fpyx (Browser Fingerprint)
- Environment Variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID

2. Backend Setup (Express)

- Create app.js, server.js, and modular folders (routes, controllers, services)
- Set up base route / to point to the confession router
- Router handles POST /submit
- Controller handles the validation and execution logic

3. Backend Validation (Incoming Request)

- Receive text and fingerprint from the frontend
- Length Check: Reject if text is under 15 or over 2,000 characters
- Regex Check (Anti-Phishing): Reject if text contains raw links (http, www., .com, .sol, .io, t.me) to prevent the channel from becoming a phishing farm
- Blocklist Check: Reject if text contains hardcoded illegal terms (doxxing, extreme slurs)

4. Backend Rate Limiting & Proof-of-Work

- Check the fingerprint against the in-memory rate limit cache
- If fingerprint has submitted less than 5 times in the last hour: proceed to execution
- If fingerprint hits the 5 submissions limit:
  - Generate a Proof-of-Work challenge (e.g., a random string + difficulty target)
  - Respond to the frontend with a 429 status and the challenge details
  - Frontend must solve the cryptographic puzzle and resubmit the text, fingerprint, and the PoW solution
  - Verify the PoW solution before proceeding to execution

5. Backend Execution

- If all checks and PoW pass, format the text
- Send an HTTP POST request to the Telegram Bot API using axios
- Payload: chat_id (channel ID), text ("CONFESSION: \n\n{text}")
- Telegram instantly publishes it
- Return success: true to the frontend

6. Frontend Setup (React)

- Create a single-page form with a textarea (Min: 15, Max: 2000 characters)
- Add a hidden input field (Honeypot) styled with display: none
- Use fpyx to generate the browser fingerprint on mount
- Add a "Submit" button that triggers a confirmation modal ("Are you sure? Cannot be deleted.")

7. Frontend Submission

- On confirm, check the Honeypot field. If filled, silently abort
- Send POST request to /submit with text and fingerprint
- If response is 429 (Rate Limit), read the PoW challenge
- Run the Proof-of-Work algorithm in the browser (e.g., hashing until the target is met)
- Resubmit the POST request with the PoW solution

8. Frontend Response

- On success, clear the textarea and show a success message
- On error, display the specific rejection reason (e.g., "Links are forbidden" or "Rate limit exceeded")
