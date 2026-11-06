import type { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  city: string;
  setCity: Dispatch<SetStateAction<string>>;
};

export default function LocationDropdown({ city, setCity }: Props) {
  return (
    <Select
      value={city}
      onValueChange={(value) => {
        if (value !== null) setCity(value);
      }}
    >
      <SelectTrigger className="w-full xs:w-45">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {city === "custom" && <SelectItem value="custom">Custom</SelectItem>}

        {locations.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const locations = [
  "Bangkok",
  "Tokyo",
  "Seoul",
  "Dubai",
  "Manila",
  "London",
  "New York",
  "Paris",
  "Berlin",
  "Madrid",
  "Rome",
  "Lisbon",
];
