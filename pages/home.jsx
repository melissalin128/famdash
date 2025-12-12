import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Pill, Sun, Sunset, Moon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import QuickCheckIn from '@/components/dashboard/QuickCheckIn';
import MedicationCard from '@/components/dashboard/MedicationCard';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import RecentCheckIns from '@/components/dashboard/RecentCheckIns';
import EmergencyContacts from '@/components/dashboard/EmergencyContacts';
import FamilyNotes from '@/components/dashboard/FamilyNotes';

const timeSlots = [
  { key: 'morning', label: 'Morning', icon: Sun, color: 'text-amber-500' },
  { key: 'afternoon', label: 'Afternoon', icon: Sun, color: 'text-orange-500' },
  { key: 'evening', label: 'Evening', icon: Sunset, color: 'text-purple-500' },
  { key: 'bedtime', label: 'Bedtime', icon: Moon, color: 'text-indigo-500' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: medications = [] } = useQuery({
    queryKey: ['medications'],
    queryFn: () => base44.entities.Medication.list(),
  });

  const { data: medicationLogs = [] } = useQuery({
    queryKey: ['medicationLogs', today],
    queryFn: () => base44.entities.MedicationLog.filter({ date: today }),
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.CalendarEvent.list(),
  });

  const { data: checkIns = [] } = useQuery({
    queryKey: ['checkIns'],
    queryFn: () => base44.entities.CheckIn.list('-created_date', 10),
  });

  const { data: emergencyContacts = [] } = useQuery({
    queryKey: ['emergencyContacts'],
    queryFn: () => base44.entities.EmergencyContact.list(),
  });

  const { data: familyNotes = [] } = useQuery({
    queryKey: ['familyNotes'],
    queryFn: () => base44.entities.FamilyNote.list('-created_date', 20),
  });

  const { data: familyMembers = [] } = useQuery({
    queryKey: ['familyMembers'],
    queryFn: () => base44.entities.User.list(),
  });

  const takenMedIds = new Set(medicationLogs.map(log => log.medication_id));
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'bedtime';
  };

  const currentMeds = medications.filter(m => m.time_of_day === currentTimeSlot());
  const pendingMeds = currentMeds.filter(m => !takenMedIds.has(m.id));

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            {getGreeting()}, {user.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </motion.div>

        {/* Quick Actions Alert */}
        {pendingMeds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl text-white shadow-xl shadow-violet-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Pill className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {pendingMeds.length} medication{pendingMeds.length > 1 ? 's' : ''} to take
                  </h3>
                  <p className="text-violet-100">
                    {currentTimeSlot().charAt(0).toUpperCase() + currentTimeSlot().slice(1)} medications are ready
                  </p>
                </div>
              </div>
              <Link
                to={createPageUrl('Medications')}
                className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Check-in Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <QuickCheckIn user={user} />
            </motion.div>

            {/* Today's Medications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-violet-500" />
                  Today's Medications
                </h2>
                <Link
                  to={createPageUrl('Medications')}
                  className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  Manage <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              {medications.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <Pill className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500">No medications added yet</p>
                  <Link
                    to={createPageUrl('Medications')}
                    className="inline-block mt-4 text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Add Medication
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {medications.map((med) => (
                    <MedicationCard
                      key={med.id}
                      medication={med}
                      isTaken={takenMedIds.has(med.id)}
                      user={user}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Family Check-ins */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RecentCheckIns checkIns={checkIns} familyMembers={familyMembers} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <UpcomingEvents events={events} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EmergencyContacts contacts={emergencyContacts} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FamilyNotes notes={familyNotes} user={user} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}