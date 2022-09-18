/* eslint-disable */
import React, { useRef, useLayoutEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  format,
  addDays,
  eachDayOfInterval,
  subDays,
  isWeekend
} from "date-fns";

console.clear();

type Props = {
  date: Date;
  daysCount: number;
  onDateChange(date: Date): void;
};

export const Calendar = (props: Props) => {
  const { date, daysCount, onDateChange } = props;
  const [width, setWidth] = useState(0);
  const root = useRef<HTMLDivElement | null>(null);
  const isUpdating = useRef(false);

  const dayWidth = width / daysCount;

  const days = useMemo(() => {
    isUpdating.current = false;
    return eachDayOfInterval({
      start: subDays(date, daysCount * 2),
      end: addDays(date, daysCount * 3)
    });
  }, [date, daysCount]);

  console.log(days.map((d) => d.getDate()));

  const renderItem = (day: Date, index: number) => {
    return (
      <Day
        key={format(day, "dd.MM.yyyy")}
        isWeekend={isWeekend(day)}
        style={{ width: `${dayWidth}px`, left: dayWidth * index }}
      >
        {format(day, "dd MMM")}
      </Day>
    );
  };

  const handleReachLeft = () => {
    onDateChange(subDays(date, daysCount));
  };

  const handleReachRight = () => {
    onDateChange(addDays(date, daysCount));
  };

  const handleScroll = () => {
    if (isUpdating.current || !root.current) {
      return;
    }

    if (root.current.scrollLeft <= dayWidth * daysCount) {
      isUpdating.current = true;
      handleReachLeft();
    } else if (root.current.scrollLeft >= dayWidth * daysCount * 3) {
      isUpdating.current = true;
      handleReachRight();
    }
  };

  const handleRef = (element: HTMLDivElement) => {
    if (element) {
      setWidth(element.offsetWidth);
      root.current = element;
      root.current?.scrollTo({
        left: dayWidth * daysCount * 2
      });
    }
  };

  return (
    <Root>
      <CalendarRoot onScroll={handleScroll} ref={handleRef}>
        <Header>Header</Header>
        <Days>{days.map(renderItem)}</Days>
      </CalendarRoot>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const CalendarRoot = styled.main`
  position: relative;
  /* flex-direction: column; */
  border: 1px solid red;
  max-width: 100%;
  /* display: flex; */
  overflow-x: scroll;
  overflow-y: scroll;
  height: 100%;
  flex-grow: 1;
  scroll-snap-type: x mandatory;
`;

const Header = styled.header`
  height: 60px;
  position: sticky;
  top: 0px;
  left: 0;
  right: 0;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
`;

const Days = styled.div`
  display: flex;
`;

const Day = styled.div<{ isWeekend: boolean }>`
  position: absolute;
  box-sizing: border-box;
  font-size: 12px;
  flex-shrink: 0;
  height: 330px;
  text-align: center;
  border-right: 1px solid #ccc;
  color: ${(p) => (p.isWeekend ? "red" : "black")};
  background: ${(p) => (p.isWeekend ? "#eee" : "#fff")};
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;
