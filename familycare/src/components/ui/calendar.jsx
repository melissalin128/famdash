import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export function Calendar({ 
  mode = 'single',
  selected,
  onSelect,
  month,
  onMonthChange,
  className = '',
  classNames = {},
  components = {},
  ...props 
}) {
  const [currentMonth, setCurrentMonth] = React.useState(month || new Date());
  const [selectedDate, setSelectedDate] = React.useState(selected || null);

  React.useEffect(() => {
    if (month) {
      setCurrentMonth(month);
    }
  }, [month]);

  React.useEffect(() => {
    if (selected) {
      setSelectedDate(selected);
    }
  }, [selected]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onSelect?.(date);
  };

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const DayContent = components.DayContent || (({ date }) => date.getDate());

  return (
    <div className={`${className}`} {...props}>
      <div className={classNames.months || 'w-full'}>
        <div className={classNames.month || 'w-full'}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 rounded-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 rounded-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week day headers */}
          <div className={classNames.head_row || 'flex w-full mb-2'}>
            {weekDays.map((day) => (
              <div
                key={day}
                className={classNames.head_cell || 'flex-1 text-slate-500 font-medium text-center py-2'}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className={classNames.table || 'w-full'}>
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
              <div key={weekIndex} className={classNames.row || 'flex w-full'}>
                {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day) => {
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      className={classNames.cell || 'flex-1 text-center relative p-0'}
                    >
                      <button
                        onClick={() => handleDateClick(day)}
                        className={`
                          ${classNames.day || 'h-12 w-full rounded-xl hover:bg-slate-100 transition-colors relative text-base'}
                          ${isSelected ? classNames.day_selected || 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                          ${isToday ? classNames.day_today || 'bg-slate-100 font-bold' : ''}
                          ${!isCurrentMonth ? classNames.day_outside || 'text-slate-300' : ''}
                        `}
                      >
                        <DayContent date={day} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

