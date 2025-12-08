import { Link } from "react-router-dom";

function CheckEmailPage() {
  return (
    // Centering on the full height of the page
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
      <div className="p-8 w-full max-w-md bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 shadow-xl text-center">
        {/* Thematic icon for email */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-emerald-900/30 mb-6">
          <svg
            className="w-8 h-8 text-emerald-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-6 5a2 2 0 01-2 2H9a2 2 0 01-2-2v-3a2 2 0 012-2h6a2 2 0 012 2v3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          Check Your Email
        </h2>

        <p className="text-slate-300 mb-6">
          A confirmation link has been sent to your email address. Please click
          the link in the email to activate your account.
        </p>

        <p className="text-sm text-slate-500 mb-6">
          You may close this window. Once verified, return to the login page.
        </p>

        {/* Button to return to the sign-in page */}
        <Link
          to="/auth"
          className="w-full inline-block bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}

export default CheckEmailPage;
