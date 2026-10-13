# Information Collection Form

A responsive React form that validates user details and opens WhatsApp with a pre-filled message. It does not send the message automatically or store form data on a server.

## Configure the WhatsApp recipient

In `src/App.jsx`, update `WHATSAPP_RECIPIENT` with the destination number's country code and phone number. Use digits only: no `+`, spaces, or punctuation.

```js
const WHATSAPP_RECIPIENT = '919876543210'
```

The value above is an example. Change it to the real recipient before using the form.

## Run in VS Code

1. Open the `form` project folder in VS Code (the folder containing `package.json`).
2. Open **Terminal → New Terminal**.
3. Install the dependencies and start Vite:

   ```sh
   npm install
   npm run dev
   ```

4. Open the local URL printed in the terminal, usually `http://localhost:5173`.

To create a production build, run `npm run build`.

## Form behavior

All fields except the additional-information message are required. The form checks email format and requires 7 to 15 digits in the mobile number. After valid submission, it opens the WhatsApp link with the information URL-encoded in the message; the user can review and send it manually. If the browser blocks the new window, allow pop-ups for the local site and submit again.
