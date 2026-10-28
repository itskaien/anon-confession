# anon-confessions Algorithm

1. Project Setup

- Frontend: React (Vite) for the web form
- Backend: Node.js + Express
- Dependencies: axios (for Telegram API), fpyx (for browser fingerprinting)
- Environment Variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID

2. Frontend

- Create a single-page form with a textarea and a character counter (Min: 15, Max: 2000)
- Add a hidden input field (Honeypot) styled with display: none
- Add a "Submit Confession" button
- On Mount: Use fpyx to generate a unique browser fingerprint (identifies the device, not the person)

3. Submission Flow (Frontend to Backend)

- User clicks "Submit"
- If the hidden Honeypot field has any text in it, silently abort (it is a bot)
- Trigger a confirmation modal: "Are you sure? This will be posted publicly and cannot be deleted."
- If confirmed, send a POST request to /api/submit with text and fingerprint

4. Backend Validation & Rate Limiting

- Length Check: Is the text between 15 and 2,000 characters? If not, reject
- Regex Check (Anti-Phishing): Does the text contain http, www., .sol, .com, or a Solana/EVM wallet address regex? If yes, reject
- Blocklist Check: Does the text contain hardcoded illegal terms (doxxing, extreme slurs) that will get the Telegram channel banned? If yes, reject
- Rate Limiting (The Fingerprint): Check the fingerprint against an in-memory cache (or Redis)
- If the fingerprint has submitted more than 5 times in the last hour, reject
- Future v2: If they hit the limit, issue a Proof-of-Work challenge instead of a hard reject

5. Execution (Backend to Telegram)

- If all checks pass, format the text
- Send an HTTP POST request to the Telegram Bot API
- chat_id: Your channel ID
- text: "CONFESSION: \n\n{text}"
- Telegram instantly publishes it to the channel

6. Database (Optional for V1)

- Save the text (without the fingerprint or IP) to PostgreSQL via Prisma
- Useful if you want to build a web archive of all past confessions

7. The Response

- Backend returns success: true to the frontend
- Frontend clears the text area and shows a success message: "Your confession has been broadcasted anonymously."
