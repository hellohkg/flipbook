export default function FlipBookDetails({ book }) {
  return (
    <div className="flip-details">
      <h2>{book.title}</h2>
      <p>{book.description}</p>
    </div>
  );
}
