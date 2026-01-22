import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar px-8 py-4 bg-indigo-500 text-white flex gap-8">
      <Link to="/" className="hover:text-indigo-900 text-xl font-bold">
        Home
      </Link>
      <Link to="/admin" className="hover:text-indigo-900 text-xl font-bold">
        Admin
      </Link>
      <Link to="/create" className="hover:text-indigo-900 text-xl font-bold">
        Quiz
      </Link>
      <Link to="/videos" className="hover:text-indigo-900 text-xl font-bold">
        Videos
      </Link>
    </nav>
  );
};

export default Navbar;
