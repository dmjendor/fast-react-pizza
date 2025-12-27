import { useNavigate, useRouteError } from "react-router-dom";

function Error() {
  const navigate = useNavigate();
  const error = useRouteError();
  const errorMessage = error.data || error.message;
  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{errorMessage}</p>
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
}

export default Error;
