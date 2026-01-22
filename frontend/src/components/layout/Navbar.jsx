import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar px-8 py-4 bg-gray-700 text-white flex gap-5">
      <Link to="/" className="hover:text-blue-400 text-xl font-bold">
        Home
      </Link>
      <Link to="/create" className="hover:text-blue-400 text-xl font-bold">
        Create Quiz
      </Link>
      <Link to="/my-videos" className="hover:text-blue-400 text-xl font-bold">
        My Videos
      </Link>
    </nav>
  );
};

export default Navbar;
