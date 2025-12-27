import { useNavigate, useRouteError } from 'react-router-dom';
import LinkButton from './LinkButton';

function Error() {
  const error = useRouteError();
  const errorMessage = error.data || error.message;
  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{errorMessage}</p>
      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
