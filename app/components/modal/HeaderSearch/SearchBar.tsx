import { IconButton, InputBase, debounce, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import lodash from "lodash";

import React, { useCallback } from "react";

const SearchBar = ({
  inputRef,
  isSearch,
  setIsSearch,
  debouncedSearch,
  getListHistory,
  setListSearch,
  color,
}) => {
  const Search = styled("div")({
    display: "flex",
    // alignItems: "center",
    backgroundColor: color,
    padding: "0.1rem 0rem 0.1rem 1.5rem",
    borderRadius: "9px",
    flexDirection: "column",
    gap: "1.5rem",
  });

  const handleClearSearch = () => {
    setIsSearch("");
    getListHistory();
    setListSearch([]);
  };

  return (
    <Search>
      <InputBase
        inputProps={{
          autoFocus: true,
        }}
        inputRef={inputRef}
        placeholder="Search..."
        value={isSearch}
        onChange={(e) => {
          const inputValue = e.target.value;

          setIsSearch((prev) => {
            if (e.target.value !== prev) {
              debouncedSearch();
            }
            return e.target.value;
          });
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            debouncedSearch();
          }
        }}
        sx={{
          fontSize: "16px",
          width: "100%",
        }}
        endAdornment={
          isSearch ? (
            <IconButton
              onClick={isSearch ? handleClearSearch : debouncedSearch}
              sx={{
                borderRadius: "9px",
                paddingInline: "1.5rem",
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : (
            <IconButton
              sx={{
                borderRadius: "9px",
                paddingInline: "1.5rem",
              }}
            >
              <SearchIcon />
            </IconButton>
          )
        }
      />
    </Search>
  );
};

export default SearchBar;
