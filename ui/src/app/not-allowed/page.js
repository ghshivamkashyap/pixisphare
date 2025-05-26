export default function NotAllowedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-600">You are not allowed to access this page.</p>
    </div>
  );
}
