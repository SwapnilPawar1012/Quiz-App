import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* HEADER BAR */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-200">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Quiz Studio <span className="text-indigo-600">Pro</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Shorts Generator
            </p>
          </div>
        </div>

        <nav className="navbar px-8 text-black flex gap-8">
          <Link to="/" className="hover:text-indigo-900 text-xl font-bold">
            Home
          </Link>
          <Link to="/admin" className="hover:text-indigo-900 text-xl font-bold">
            Admin
          </Link>
          <Link
            to="/quiz-generator"
            className="hover:text-indigo-900 text-xl font-bold"
          >
            Quiz Generator
          </Link>
          <Link
            to="/videos"
            className="hover:text-indigo-900 text-xl font-bold"
          >
            Videos
          </Link>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
