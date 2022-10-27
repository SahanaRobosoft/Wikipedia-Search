import React from "react";
import { Result } from "./Search";

type SearchResultType = {
  result: Result;
};

const SearchResult = ({ result }: SearchResultType) => {
  const [query, search, details, link] = result;

  return (
    <div className="mt-2">
      {query && <h3>Search results for "{query}"</h3>}
      <ul className="list-group">
        {search?.map((name, index) => (
          <li key={`${name}-${search}`} className="list-group-item">
            <a href={link[index]} rel="noreferrer" target="_blank">
              <h4>{name}</h4>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;
