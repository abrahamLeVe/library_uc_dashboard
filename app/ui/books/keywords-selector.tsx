"use client";
import { useState } from "react";

interface Keyword {
  id: number;
  nombre: string;
}

export default function KeywordSelector({
  keywords,
  selectedKeywords,
  setSelectedKeywords,
}: {
  keywords: Keyword[];
  selectedKeywords: string[];
  setSelectedKeywords: (keywords: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAddKeyword = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !selectedKeywords.includes(trimmed)) {
      setSelectedKeywords([...selectedKeywords, trimmed]);
    }
    setInputValue("");
  };

  const handleRemoveKeyword = (value: string) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k !== value));
  };

  const filteredSuggestions = keywords
    .map((k) => k.nombre)
    .filter(
      (k) =>
        !selectedKeywords.includes(k) &&
        k.toLowerCase().includes(inputValue.toLowerCase())
    );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedKeywords.map((k) => (
          <span
            key={k}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
          >
            {k}
            <button type="button" onClick={() => handleRemoveKeyword(k)}>
              x
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddKeyword(inputValue);
          }
        }}
        placeholder="Escribe o selecciona una palabra clave..."
        className="w-full border rounded px-3 py-2"
      />
      {filteredSuggestions.length > 0 && (
        <ul className="border rounded bg-white mt-1 max-h-32 overflow-y-auto">
          {filteredSuggestions.map((s) => (
            <li
              key={s}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAddKeyword(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
