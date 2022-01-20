import { useReducer, useState } from "react";

import { icons } from "./shared/constant";

const reducer = (state, action) => {
  switch (action.type) {
    case "add":
      const merged = [...new Set([...state.suggestions, action.payload])];
      console.log(merged);
      localStorage.setItem("suggestions", JSON.stringify(merged));
      return { suggestions: merged };
    default:
      return state;
  }
};

export default function App() {
  const [filteredIcons, setFilteredIcons] = useState(icons);
  const [inputValue, setInputValue] = useState("");

  const [state, dispatch] = useReducer(reducer, {
    suggestions: JSON.parse(localStorage.getItem("suggestions") || "[]"),
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setFilteredIcons(icons);
    } else {
      dispatch({
        type: "add",
        payload: inputValue.trim(),
      });
      setInputValue("");
      setFilteredIcons(
        icons.filter(
          (icon) =>
            icon.name.includes(inputValue.trim()) ||
            icon.link.includes(inputValue.trim())
        )
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-7">
      <img className="w-[272px] h-auto" src="/google.png" alt="" />

      <div className="h-[45px] w-screen max-w-[550px] relative group">
        <form
          onSubmit={handleFormSubmit}
          className="relative h-[45px] w-full rounded-full overflow-hidden"
          style={{ boxShadow: "2px 2px 7px lightgray" }}
        >
          <button
            type="submit"
            className="absolute top-1/2 -translate-y-1/2 left-4"
          >
            <i className="fas fa-search text-[#5F6367]"></i>
          </button>
          <input
            className="w-full h-full outline-none px-10"
            type="text"
            placeholder="Search Google or type a URL"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setFilteredIcons(icons);
            }}
          />
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-4"
          >
            <i className="fas fa-microphone text-[#5F6367]"></i>
          </button>
        </form>

        <div className="absolute top-full left-0 w-full flex flex-col items-stretch bg-white border-t shadow-md transition-all duration-300 opacity-0 invisible group-focus-within:visible group-focus-within:opacity-100">
          {state.suggestions
            .filter((suggestion) => suggestion.includes(inputValue.trim()))
            .slice(0, 10)
            .map((value, index) => (
              <button
                onClick={() => setInputValue(value)}
                className="py-[6px] px-3 flex gap-2 items-center cursor-pointer text-left"
              >
                <i className="far fa-clock"></i>
                <span>{value}</span>
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {filteredIcons.map((icon) => (
          <a
            href={icon.link}
            target="_blank"
            className="flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-[#F2F3F4] flex justify-center items-center">
              <img className="w-6 h-6 object-cover" src={icon.icon} alt="" />
            </div>

            <p className="max-w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
              {icon.name}
            </p>
          </a>
        ))}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#F2F3F4] flex justify-center items-center">
            <i className="fas fa-plus"></i>
          </div>

          <p className="max-w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
            Add shortcut
          </p>
        </div>
      </div>
    </div>
  );
}
