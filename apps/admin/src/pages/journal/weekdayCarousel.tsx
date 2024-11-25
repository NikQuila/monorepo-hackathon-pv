import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@common/components/ui/carousel";
import { DateTime } from "luxon";

const WeekdayCarousel = ({
  weeks,
  selectedDate,
  handleDayClick,
}: {
  weeks: DateTime[][];
  selectedDate: DateTime;
  handleDayClick: (day: DateTime) => void;
}) => {
  const getDayName = (date: DateTime) =>
    date.setLocale("es").toLocaleString({ weekday: "long" });

  const getDayNumber = (date: DateTime) => date.toFormat("d");

  const getSelectedWeekIndex = (weeks: DateTime[][], selectedDate: DateTime) => {
    return weeks.findIndex((week) =>
      week.some((day) => day.hasSame(selectedDate, "day"))
    );
  };

  const selectedWeekIndex = getSelectedWeekIndex(weeks, selectedDate);

  return (
    <Carousel
      className="w-full overflow-hidden mx-2"
      opts={{
        startIndex: selectedWeekIndex,
        align: "center",
        containScroll: "trimSnaps",
      }}
    >
      <CarouselContent>
        {weeks.map((week, weekIndex) => (
          <CarouselItem
            key={weekIndex}
            className="flex basis-full flex-shrink-0 justify-between items-center gap-4"
          >
            {week.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="text-xs font-bold capitalize">
                  {getDayName(day).charAt(0)}
                </span>
                <button
                  onClick={() => handleDayClick(day)}
                  className={`flex flex-col items-center justify-center size-7 rounded-full transition-colors ${
                    day.hasSame(selectedDate, "day")
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-400"
                  }`}
                >
                  <span className="text-sm font-bold">{getDayNumber(day)}</span>
                </button>
              </div>
            ))}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default WeekdayCarousel
