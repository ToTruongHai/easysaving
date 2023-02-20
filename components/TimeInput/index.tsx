import React from "react";
import { Time } from "./constants";

const TimeInput = ({ defaultHours, defaultMinutes }: any) => {
  return (
    <div className="flex justify-center flex-col">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1">
        Thời Gian:
      </label>
      <div className="w-full bg-white rounded-lg shadow-inner drop-shadow-lg">
        <div className="py-2 flex justify-center item-center">
          <select
            name="hours"
            defaultValue={defaultHours}
            className="bg-transparent  appearance-none outline-none font-light text-sm"
          >
            {Time?.Hours?.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          <span className="mx-2 relative bottom-px">:</span>
          <select
            defaultValue={defaultMinutes}
            name="minutes"
            className="bg-transparent  appearance-none outline-none font-light text-sm"
          >
            {Time?.Minutes?.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
