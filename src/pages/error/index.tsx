import { Link, useRouteError } from 'react-router-dom';

const errorText = {
  401: 'You are not authorized to access this page.',
  404: "We can't find the page you're looking for.",
  500: 'Something went wrong on our side. Please try again later.',
  502: 'The server received an invalid response from the upstream server.',
  503: "We're currently unable to handle your request due to temporary overloading or maintenance of the server.",
  504: 'The server is taking too long to respond. ',
  default: 'An error occurred while processing your request.',
};

function ErrorPage() {
  const error = useRouteError() as never;
  const { status, statusText } = error;

  return (
    <div className="flex flex-grow bg-primary px-[16dvw] py-[16dvh]">
      <div className="flex-grow-1 flex flex-col items-start gap-2 text-white">
        <h1 className="text-9xl">:(</h1>
        <h2 className="text-4xl mt-6">Oops! Something went wrong.</h2>
        <p className="text-xl">
          {errorText[status as keyof typeof errorText] || errorText.default}
        </p>
        <p className="text-md mt-6">
          {status && statusText && `Error: ${status} - ${statusText}`}
        </p>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}

export default ErrorPage;
