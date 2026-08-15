"use client";

interface DropDown {
  options: string[];
  onChange(week: string): void;
  currentSelection: string;
  title: string;
}

//The whole pill is the control, not just the value on the right.
//
//The <select> is stretched over the entire component and made invisible; the
//title and the value underneath are what you actually see. Clicking the label,
//the value or the gap between them all land on the select, so the native
//picker opens from anywhere on the pill - including on a phone, where the
//value chip alone was a small target.
export default function DropDown(props: DropDown) {
  function updater(event: any) {
    props.onChange(event.target.value);
  }
  let key = 0;
  return (
    <div className="drop-down">
      <div className="drop-down-title">{props.title}</div>
      {/* the visible value - the real one lives in the select on top of it */}
      <div className="drop-down-value" aria-hidden="true">
        {props.currentSelection}
      </div>
      <select
        className="drop-down-select"
        value={props.currentSelection}
        aria-label={props.title}
        onChange={updater}
      >
        {props.options.map((opt) => (
          <option key={key++} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
