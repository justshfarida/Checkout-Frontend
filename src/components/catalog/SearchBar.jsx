import { useEffect, useRef } from "react";

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);//runs after component's initial run

  return (
    <div className="search-wrap">
      <span>⌕</span>
      <input
        ref={inputRef}
        value={value} //controlled input
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search game items..."
      />
    </div>
  );
}
