import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Stethoscope, Users, Bell, CalendarDays, MapPin, Clock, Trash2, Edit2, Check } from 'lucide-react';

const eventTypes = [
  { key: 'doctor', label: 'Medical', icon: Stethoscope, color: 'bg-red-100 text-red-600 border-red-200' },
  { key: 'family', label: 'Family', icon: Users, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { key: 'reminder', label: 'Reminder', icon: Bell, color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { key: 'other', label: 'Other', icon: CalendarDays, color: 'bg-slate-100 text-slate-600 border-slate-200' },
];

export default function Calendar() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    event_type: 'other',
    location: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.CalendarEvent.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CalendarEvent.create({ ...data, for_member: user.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CalendarEvent.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CalendarEvent.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: '',
      event_type: 'other',
      location: ''
    });
    setEditingEvent(null);
    setIsOpen(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time || '',
      event_type: event.event_type || 'other',
      location: event.location || ''
    });
    setEditingEvent(event);
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const selectedDateEvents = events.filter(e => 
    isSameDay(parseISO(e.date), selectedDate)
  ).sort((a, b) => {
    if (!a.time && !b.time) return 0;
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  const daysWithEvents = new Set(
    events.map(e => format(parseISO(e.date), 'yyyy-MM-dd'))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-blue-500" />
              Calendar
            </h1>
            <p className="text-slate-500 mt-1">Keep track of appointments and events</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setFormData(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }))}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6 text-base shadow-lg shadow-blue-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-base">Event Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Doctor's appointment"
                    className="rounded-xl py-6 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Event Type</Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(val) => setFormData({ ...formData, event_type: val })}
                  >
                    <SelectTrigger className="rounded-xl py-6 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.key} value={type.key} className="py-3">
                            <span className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {type.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base">Date *</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="rounded-xl py-6 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Time</Label>
                    <Input
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g., 2:00 PM"
                      className="rounded-xl py-6 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., City Medical Center"
                    className="rounded-xl py-6 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Notes</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Any additional details..."
                    className="rounded-xl py-6 text-base"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 rounded-xl py-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending || !formData.title.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {editingEvent ? 'Save Changes' : 'Add Event'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardContent className="p-6">
              <CalendarUI
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && handleDateSelect(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-xl w-full"
                classNames={{
                  months: "w-full",
                  month: "w-full",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  head_cell: "flex-1 text-slate-500 font-medium text-center py-3",
                  row: "flex w-full",
                  cell: "flex-1 text-center relative p-0 [&:has([aria-selected])]:bg-transparent",
                  day: "h-12 w-full rounded-xl hover:bg-slate-100 transition-colors relative text-base",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                  day_today: "bg-slate-100 font-bold",
                  day_outside: "text-slate-300",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const hasEvent = daysWithEvents.has(dateStr);
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {date.getDate()}
                        {hasEvent && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Selected Day Events */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">
                {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events scheduled</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
                      setIsOpen(true);
                    }}
                    className="text-blue-600 mt-2"
                  >
                    Add an event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {selectedDateEvents.map((event, index) => {
                      const typeConfig = eventTypes.find(t => t.key === event.event_type) || eventTypes[3];
                      const Icon = typeConfig.icon;
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-2xl border-2 ${typeConfig.color} group`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{event.title}</h4>
                              {event.time && (
                                <p className="text-sm flex items-center gap-1 mt-1 opacity-80">
                                  <Clock className="w-3 h-3" />
                                  {event.time}
                                </p>
                              )}
                              {event.location && (
                                <p className="text-sm flex items-center gap-1 mt-1 opacity-80">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </p>
                              )}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button
                                onClick={() => handleEdit(event)}
                                className="p-1.5 rounded-lg hover:bg-white/50"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteMutation.mutate(event.id)}
                                className="p-1.5 rounded-lg hover:bg-white/50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}