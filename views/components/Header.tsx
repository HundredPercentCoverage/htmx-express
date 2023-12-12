const Header: React.FC = () => {
  return (
    <header className="w-full bg-black text-white flex justify-between items-center p-2">
      <h2>To Do</h2>
      <nav>
        <ul className="flex gap-2 items-center list-none">
          <li>
            <a href="#">Link 1</a>
          </li>
          <li>
            <a href="#">Link 2</a>
          </li>
          <li>
            <button hx-post="/auth/logout">Log Out</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
