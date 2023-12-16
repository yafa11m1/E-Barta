// pages/unauthorized-access.js
import Link from 'next/link';

const UnauthorizedAccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Unauthorized Access</h1>
        <p className="text-gray-700 mb-4">
          You do not have permission to access this page. Please log in to continue.
        </p>
        <Link className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" href="/login">
          
            Go to Login
         
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedAccessPage;
