import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useProductAutocomplete } from '../hooks/useQueries';

interface ProductSearchBarProps {
  onProductSelect: (productName: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ProductSearchBar({ 
  onProductSelect, 
  placeholder = "Search for a product...",
  className = ""
}: ProductSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { suggestions, isLoading } = useProductAutocomplete(searchQuery);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when there are suggestions
  useEffect(() => {
    if (suggestions.length > 0 && searchQuery.trim()) {
      setShowDropdown(true);
      setSelectedIndex(-1);
    } else {
      setShowDropdown(false);
    }
  }, [suggestions, searchQuery]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onProductSelect(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter' && searchQuery.trim()) {
        e.preventDefault();
        onProductSelect(searchQuery.trim());
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (searchQuery.trim()) {
          onProductSelect(searchQuery.trim());
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-4 py-6 text-lg border-2 border-emerald-200 focus:border-emerald-400 rounded-full shadow-md"
        />
      </div>
      
      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border-2 border-emerald-200 rounded-2xl shadow-lg max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-6 py-4 hover:bg-emerald-50 transition-colors border-b border-emerald-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl ${
                index === selectedIndex ? 'bg-emerald-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-emerald-900 font-medium">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {isLoading && searchQuery.trim() && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
        </div>
      )}
    </div>
  );
}
