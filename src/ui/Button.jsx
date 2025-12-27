import { Link } from 'react-router-dom';

function Button({ children, disabled, to }) {
  const className =
    'focus: inline-block rounded-full bg-yellow-400 px-3 py-4 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed sm:px-6 md:py-4';
  if (to)
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  return (
    <button className={className} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
