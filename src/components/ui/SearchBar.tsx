"use client";
import { useState, FormEvent, ChangeEvent, useRef } from "react";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

export function SearchBar() {
  interface Suggestion {
    _id: string;
    name: string;
    location: string;
    description: string;
  }

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/searchMuseums?query=${searchTerm}`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (searchTerm.length > 2) {
      debounceTimeout.current = setTimeout(() => {
        fetchSuggestions(searchTerm);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with query:", query);
  };

  return (
    <div className="flex justify-center w-full">
      <div className="relative flex w-full mt-8 max-w-3xl mx-4">
        <form onSubmit={handleSubmit} className="w-full mt-8">
          <PlaceholdersAndVanishInput
            placeholders={["Search for museums", "Search for events", "Find tickets"]}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
          {loading && (
            <div className="absolute z-10 bg-white border border-gray-300 w-full mt-2 p-2">
              Loading...
            </div>
          )}
          {suggestions.length === 0 && query.length > 2 && !loading && (
            <div className="absolute z-10 bg-white border border-gray-300 w-full mt-2 p-2">
              No results found
            </div>
          )}
          {suggestions.length > 0 && !loading && (
            <div className="absolute z-10 bg-white border border-gray-300 w-full mt-2">
              {suggestions.map((item) => (
                <div key={item._id} className="p-2 hover:bg-gray-100">
                  {item.name} - {item.location}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
