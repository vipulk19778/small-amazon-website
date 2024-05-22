import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  "& .MuiInputBase-root": {
    color: "white",
    p: 0,
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "white",
  },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
};

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : `/search`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitHandler(e);
    }
  };
  return (
    <form onSubmit={submitHandler}>
      <TextField
        type="text"
        size="small"
        name="searchBox"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Products"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button type="submit" sx={{ height: "32px" }}>
                <i className="fas fa-search" style={{ color: "white" }}></i>
              </Button>
            </InputAdornment>
          ),
        }}
        sx={styles}
      ></TextField>
    </form>
  );
};

export default SearchBox;
