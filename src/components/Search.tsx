import React, { useState } from "react";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/lib/string";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import axios from "axios";
import SearchResult from "./SearchResult";

const BASE_URL =
  "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=";

export type Result = [string, string[], string[]];

const Search = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const getInputValue = (
    inputEvent: React.ChangeEvent<HTMLInputElement>
  ): string => {
    return pipe(inputEvent.target.value, S.trim);
  };

  const getUrl = (query: string): string => {
    return `${BASE_URL}${query}`;
  };

  const fetchResult = (url: string) => {
    return TE.tryCatch<Error, Result>(
      () => axios.get(url).then((res) => res.data),
      (reason) => new Error(String(reason))
    )();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      searchResult(e);
    } else {
      setResult([] as unknown as Result);
    }
  };

  const searchResult = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = pipe(e, getInputValue, getUrl);
    fetchResult(url)
      .then((response) =>
        pipe(
          response,
          E.getOrElse<Error, Result | null>(() => null)
        )
      )
      .then(setResult);
  };

  return (
    <div>
      <div style={{ width: "90%", margin: "auto" }}>
        <h1>Wikipedia Search</h1>
        <input
          type="text"
          value={search}
          className="form-control w-50"
          placeholder="Type something..."
          onChange={handleChange}
        />
        {result && <SearchResult result={result} />}
      </div>
    </div>
  );
};

export default Search;
