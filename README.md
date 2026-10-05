# NovaLearn

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string. The configured database defaults to `novalearn`.
3. Start MongoDB, then run `npm run dev`.
4. Open `http://localhost:5173`.

The development server proxies `/api` requests to the Express API on port 3001. Successful enrollments are inserted into the `enrollments` collection with a timestamp. Without a MongoDB URI, the form reports that enrollment is unavailable and does not show a false success state.

For a production build, run `npm run build` followed by `npm start`. Express serves the built site and the enrollment API on port 3001. Set `PORT` to change that port.