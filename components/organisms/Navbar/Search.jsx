export default function Search() {
  return (
    <div className="iq-search-bar">
      <form action="#" className="searchbox">
        <input
          type="text"
          className="text search-input"
          placeholder="Type here to search..."
        />
        <a className="search-link" href="#">
          <i className="ri-search-line"></i>
        </a>
      </form>
    </div>
  );
}
