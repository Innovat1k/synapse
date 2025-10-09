import { Link } from 'react-router-dom';
// Optionnel: Si vous avez un logo local, vous pouvez l'importer ici

function CheckEmailPage() {
  return (
    // Centrage sur toute la hauteur de la page
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-xl text-center">
        
        {/* Icône thématique pour l'e-mail */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-6">
          <svg 
            className="w-8 h-8 text-emerald-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-6 5a2 2 0 01-2 2H9a2 2 0 01-2-2v-3a2 2 0 012-2h6a2 2 0 012 2v3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Check Your Email
        </h2>

        <p className="text-gray-600 mb-6">
          A confirmation link has been sent to your email address. 
          Please click the link in the email to activate your account.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          You may close this window. Once verified, return to the login page.
        </p>
        
        {/* Bouton de retour à la page de connexion */}
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