"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CalendarEvent {
  id: number
  title: string
  date: string
  color: string
}

interface TimedEvent {
  id: number
  title: string
  date: string
  startHour: number
  endHour: number
  color: string
}

const eventColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
]

const getRandomColor = (seed: number) => {
  return eventColors[seed % eventColors.length]
}

const hours = [
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
  "12 AM",
]

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewType, setViewType] = useState<"Month" | "Week" | "Day">("Month")
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date()
    const day = now.getDay()
    const diff = day === 0 ? -6 : 1 - day // Adjust to start week on Monday
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff)
  })
  const [dayViewDate, setDayViewDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    if (viewType === "Month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (viewType === "Week") {
      setWeekStart(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() - 7))
    } else {
      setDayViewDate(new Date(dayViewDate.getFullYear(), dayViewDate.getMonth(), dayViewDate.getDate() - 1))
    }
  }

  const goToNext = () => {
    if (viewType === "Month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (viewType === "Week") {
      setWeekStart(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7))
    } else {
      setDayViewDate(new Date(dayViewDate.getFullYear(), dayViewDate.getMonth(), dayViewDate.getDate() + 1))
    }
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDate(now)
    const day = now.getDay()
    const diff = day === 0 ? -6 : 1 - day
    setWeekStart(new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff))
    setDayViewDate(now)
  }

  const dynamicEvents = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return [
      {
        id: 1,
        title: "Design review",
        date: `${year}-${String(month + 1).padStart(2, "0")}-03`,
        color: getRandomColor(1),
      },
      {
        id: 2,
        title: "Sales meeting",
        date: `${year}-${String(month + 1).padStart(2, "0")}-03`,
        color: getRandomColor(2),
      },
      {
        id: 3,
        title: "Date night",
        date: `${year}-${String(month + 1).padStart(2, "0")}-07`,
        color: getRandomColor(3),
      },
      {
        id: 4,
        title: "Sam's birthday party",
        date: `${year}-${String(month + 1).padStart(2, "0")}-12`,
        color: getRandomColor(4),
      },
      {
        id: 5,
        title: "Maple syrup museum",
        date: `${year}-${String(month + 1).padStart(2, "0")}-22`,
        color: getRandomColor(5),
      },
      {
        id: 6,
        title: "Hockey game",
        date: `${year}-${String(month + 1).padStart(2, "0")}-22`,
        color: getRandomColor(6),
      },
      {
        id: 7,
        title: "Cinema with friends",
        date: `${year}-${String(month + 2).padStart(2, "0")}-04`,
        color: getRandomColor(7),
      },
    ]
  }, [currentDate])

  const timedEvents: TimedEvent[] = useMemo(() => {
    const today = new Date()
    const dateStr = today.toISOString().split("T")[0]
    return [
      {
        id: 1,
        title: "Team Meeting",
        date: dateStr,
        startHour: 10,
        endHour: 11,
        color: "bg-blue-100 border-l-4 border-blue-400",
      },
    ]
  }, [])

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    let startDay = firstDayOfMonth.getDay() - 1
    if (startDay === -1) startDay = 6

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }

    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }

    return days
  }, [currentDate])

  const weekDays = useMemo(() => {
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      days.push(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i))
    }
    return days
  }, [weekStart])

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return dynamicEvents.filter((event) => event.date === dateStr)
  }

  const getTimedEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return timedEvents.filter((event) => event.date === dateStr)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const isSaturday = (date: Date) => {
    return date.getDay() === 6
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getHeaderTitle = () => {
    if (viewType === "Month") {
      return formatMonth(currentDate)
    } else if (viewType === "Week") {
      const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6)
      const startMonth = weekStart.toLocaleDateString("en-US", { month: "long" })
      const endMonth = weekEnd.toLocaleDateString("en-US", { month: "long" })
      const year = weekEnd.getFullYear()
      if (startMonth === endMonth) {
        return `${startMonth} ${year}`
      } else {
        return `${startMonth} - ${endMonth} ${year}`
      }
    } else {
      return dayViewDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    }
  }

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const hourIndex = hours === 0 ? 23 : hours - 1
    const position = hourIndex * 48 + (minutes / 60) * 48
    return position
  }

  const shouldShowTimeIndicator = (date: Date) => {
    return isToday(date)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 md:p-6 border-b border-gray-200 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{getHeaderTitle()}</h1>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <div className="flex items-center bg-gray-100 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-600 hover:text-gray-900"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Today
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-600 hover:text-gray-900"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-100 border-0 text-gray-700 hover:bg-gray-200">
                {viewType} view
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewType("Month")}>Month view</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType("Week")}>Week view</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType("Day")}>Day view</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {viewType === "Month" && (
        <div className="w-full">
          <div className="w-full">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="px-1 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day.date)
                const isCurrentDay = isToday(day.date)
                const isSelectedDay = isSelected(day.date)
                const isSat = isSaturday(day.date)

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[60px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px] p-0.5 sm:p-1 md:p-2 border-b border-r border-gray-100
                      ${!day.isCurrentMonth ? "bg-gray-50" : "bg-white"}
                      ${isSelectedDay ? "bg-blue-50" : ""}
                      hover:bg-gray-50 transition-colors
                    `}
                  >
                    <div className="flex justify-start mb-0.5 sm:mb-1">
                      <span
                        className={`
                          inline-flex items-center justify-center text-[10px] sm:text-xs md:text-sm
                          ${isCurrentDay ? "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-blue-600 text-white rounded-full" : ""}
                          ${isSat && day.isCurrentMonth && !isCurrentDay ? "text-blue-600" : ""}
                          ${!day.isCurrentMonth ? "text-gray-400" : "text-gray-700"}
                          ${day.isCurrentMonth && !isCurrentDay && !isSat ? "text-gray-900" : ""}
                        `}
                      >
                        {day.date.getDate()}
                      </span>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 overflow-hidden">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`
                            ${event.color} text-white text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 
                            rounded truncate cursor-pointer hover:opacity-90 transition-opacity
                            max-w-full overflow-hidden text-ellipsis whitespace-nowrap
                          `}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {viewType === "Week" && (
        <div className="w-full overflow-x-auto">
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b border-gray-200 min-w-[600px]">
            <div className="px-2 py-3 text-center text-xs font-medium text-gray-400">
              GMT{new Date().getTimezoneOffset() <= 0 ? "+" : "-"}
              {Math.abs(new Date().getTimezoneOffset() / 60)}
            </div>
            {weekDays.map((day, index) => {
              const dayName = day.toLocaleDateString("en-US", { weekday: "short" })
              const dayNum = day.getDate()
              const isTodayDay = isToday(day)
              return (
                <div
                  key={index}
                  className={`px-2 py-3 text-center text-sm ${isTodayDay ? "font-bold text-gray-900" : "font-medium text-gray-500"}`}
                >
                  {dayName} {dayNum}
                </div>
              )
            })}
          </div>

          {/* Week Grid with Hours */}
          <div className="relative min-w-[600px]">
            {hours.map((hour, hourIndex) => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
                <div className="px-2 py-3 text-xs text-gray-400 text-right pr-4 h-12 flex items-start justify-end">
                  {hour}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const isTodayDay = isToday(day)
                  const events = getTimedEventsForDate(day)
                  const hourEvents = events.filter((e) => e.startHour === hourIndex + 1)

                  return (
                    <div
                      key={dayIndex}
                      className={`border-l border-gray-100 h-12 relative ${isTodayDay ? "bg-gray-50/50" : ""}`}
                    >
                      {hourEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`absolute inset-x-0 mx-1 ${event.color} rounded px-2 py-1 text-xs text-gray-800`}
                          style={{
                            height: `${(event.endHour - event.startHour) * 48}px`,
                            zIndex: 10,
                          }}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-gray-500 text-[10px]">
                            {event.startHour}am - {event.endHour}am
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Current Time Indicator for Week View */}
            {weekDays.some((day) => isToday(day)) && (
              <div
                className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                style={{ top: `${getCurrentTimePosition()}px` }}
              >
                <div className="w-[12.5%]" />
                <div className="flex items-center flex-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
                  <div className="flex-1 h-[2px] bg-red-500" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewType === "Day" && (
        <div className="w-full">
          {/* Day Grid with Hours */}
          <div className="relative">
            {hours.map((hour, hourIndex) => {
              const events = getTimedEventsForDate(dayViewDate)
              const hourEvents = events.filter((e) => e.startHour === hourIndex + 1)

              return (
                <div key={hour} className="flex border-b border-gray-100">
                  <div className="w-16 sm:w-20 px-2 py-3 text-xs text-gray-400 text-right pr-4 h-12 flex items-start justify-end flex-shrink-0">
                    {hour}
                  </div>
                  <div className="flex-1 border-l border-gray-100 h-12 relative">
                    {hourEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`absolute inset-x-0 mx-2 ${event.color} rounded px-3 py-2 text-sm text-gray-800`}
                        style={{
                          height: `${(event.endHour - event.startHour) * 48}px`,
                          zIndex: 10,
                        }}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-gray-500 text-xs">
                          {event.startHour}am - {event.endHour}am
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Current Time Indicator for Day View */}
            {isToday(dayViewDate) && (
              <div
                className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                style={{ top: `${getCurrentTimePosition()}px` }}
              >
                <div className="w-16 sm:w-20" />
                <div className="flex items-center flex-1">
                  <div className="w-2 h-2 bg-gray-900 rounded-full -ml-1" />
                  <div className="flex-1 h-[2px] bg-gray-900" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
