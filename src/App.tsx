import { startOfWeek } from "date-fns";
import { useState } from "react";
import { Calendar } from "./components/Calendar";

export default function App() {
  const [date, setDate] = useState(startOfWeek(new Date()));
  return <Calendar date={date} daysCount={7} onDateChange={setDate} />;
}
