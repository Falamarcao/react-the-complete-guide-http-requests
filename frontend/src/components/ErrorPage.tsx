interface ErrorPageProps {
  title: string;
  message: string;
  onConfirm?: () => void;
}

export default function ErrorPage({
  title,
  message,
  onConfirm,
}: ErrorPageProps) {
  return (
    <div className="error">
      <h2>{title}</h2>
      <p>{message}</p>
      {onConfirm && (
        <div id="confirmation-actions">
          <button onClick={onConfirm} className="button">
            Okay
          </button>
        </div>
      )}
    </div>
  );
}
