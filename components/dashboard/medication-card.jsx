import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Check, Clock, Pill, Sun, Sunset, Moon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const timeIcons = {
  morning: { icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
  afternoon: { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
  evening: { icon: Sunset, color: 'text-purple-500', bg: 'bg-purple-50' },
  bedtime: { icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
};

export default function MedicationCard({ medication, isTaken, onTake, user }) {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];
  
  const takeMutation = useMutation({
    mutationFn: () => base44.entities.MedicationLog.create({
      medication_id: medication.id,
      taken_at: new Date().toISOString(),
      taken_by: user.email,
      date: today
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicationLogs'] });
    }
  });

  const timeConfig = timeIcons[medication.time_of_day] || timeIcons.morning;
  const TimeIcon = timeConfig.icon;

  return (
    <motion.div
      whileHover={{ scale: isTaken ? 1 : 1.02 }}
      whileTap={{ scale: isTaken ? 1 : 0.98 }}
    >
      <Card className={`border-0 shadow-md transition-all overflow-hidden ${
        isTaken 
          ? 'bg-slate-50 opacity-75' 
          : 'bg-white hover:shadow-lg'
      }`}>
        <CardContent className="p-0">
          <div className="flex items-stretch">
            <div className={`w-2 ${isTaken ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            <div className="flex-1 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${timeConfig.bg} flex items-center justify-center text-3xl`}>
                  {medication.icon || '💊'}
                </div>
                <div>
                  <h4 className={`font-semibold text-lg ${isTaken ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {medication.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm ${isTaken ? 'text-slate-400' : 'text-slate-600'}`}>
                      {medication.dosage}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className={`flex items-center gap-1 text-sm ${timeConfig.color}`}>
                      <TimeIcon className="w-4 h-4" />
                      {medication.time_of_day}
                    </span>
                  </div>
                  {medication.instructions && (
                    <p className="text-xs text-slate-400 mt-1">{medication.instructions}</p>
                  )}
                </div>
              </div>
              
              {!isTaken ? (
                <Button
                  onClick={() => takeMutation.mutate()}
                  disabled={takeMutation.isPending}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-6 text-base font-medium shadow-lg shadow-emerald-200"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Take
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">Taken</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}