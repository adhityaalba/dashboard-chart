import Sidebar from '../components/Sidebar';

const Account = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold">Account</h1>
        <p>Welcome to the Account!</p>
      </div>
    </div>
  );
};

export default Account;
