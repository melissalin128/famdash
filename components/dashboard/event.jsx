import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, isToday, isTomorrow, addDays, isWithinInterval } from 'date-fns';
import { Calendar, Clock, MapPin, Stethoscope, Users, Bell, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const eventTypeConfig = {
  doctor: { icon: Stethoscope, color: 'bg-red-100 text-red-600', label: 'Medical' },
  family: { icon: Users, color: 'bg-blue-100 text-blue-600', label: 'Family' },
  reminder: { icon: Bell, color: 'bg-amber-100 text-amber-600', label: 'Reminder' },
  other: { icon: CalendarDays, color: 'bg-slate-100 text-slate-600', label: 'Event' },
};

export default function UpcomingEvents({ events }) {
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  const upcomingEvents = events
    .filter(event => {
      const eventDate = parseISO(event.date);
      return isWithinInterval(eventDate, { start: today, end: nextWeek });
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const formatEventDate = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  if (upcomingEvents.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-8 text-slate-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming events this week</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => {
            const config = eventTypeConfig[event.event_type] || eventTypeConfig.other;
            const Icon = config.icon;
            const eventDate = parseISO(event.date);
            const isEventToday = isToday(eventDate);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-2xl ${isEventToday ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 truncate">{event.title}</h4>
                    <p className={`text-sm font-medium ${isEventToday ? 'text-blue-600' : 'text-slate-500'}`}>
                      {formatEventDate(event.date)}
                      {event.time && ` at ${event.time}`}
                    </p>
                    {event.location && (
                      <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}