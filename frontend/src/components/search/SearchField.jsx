import React, { useState, useEffect } from 'react';

const SearchField = ({ toys = [], onSearchSelect, onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([]);
    } else {
      const query = inputValue.toLowerCase();
      const filteredSuggestions = toys.filter(toy =>
        toy.name.toLowerCase().includes(query) ||
        toy.collection?.toLowerCase().includes(query) ||
        toy.series?.toLowerCase().includes(query) ||
        toy.brand?.toLowerCase().includes(query) ||
        toy.company?.toLowerCase().includes(query)
      ).slice(0, 10); // Removed the limit of 10 suggestions

      setSuggestions(filteredSuggestions);
    }
  }, [inputValue, toys]);

  const handleSuggestionSelect = (suggestion) => {
    onSearchSelect(suggestion); // Propagate selection to parent to filter content
    setSuggestions([]); // Clear suggestions
    setInputValue(suggestion.name); // Set input value to the selected suggestion's name
  };

  const handleSearchButtonClick = () => {
    onSearch(inputValue); // Propagate the full search action to parent
    setSuggestions([]); // Optionally clear suggestions
  };

  return (
    <div className="search-field">
      <input
        type="text"
        placeholder="Search toys..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={() => onSearch(inputValue)}>Search</button>
      {suggestions.length > 0 && (
        <ul className="suggestions-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => handleSuggestionSelect(suggestion)}>
              {suggestion.name} ({suggestion.company})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchField;
