import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, ThumbsUp, Meh, Frown, Send, Check } from 'lucide-react';

const moods = [
  { value: 'great', icon: Smile, label: 'Great!', color: 'bg-emerald-100 text-emerald-600 border-emerald-200', activeColor: 'bg-emerald-500 text-white' },
  { value: 'good', icon: ThumbsUp, label: 'Good', color: 'bg-sky-100 text-sky-600 border-sky-200', activeColor: 'bg-sky-500 text-white' },
  { value: 'okay', icon: Meh, label: 'Okay', color: 'bg-amber-100 text-amber-600 border-amber-200', activeColor: 'bg-amber-500 text-white' },
  { value: 'not_great', icon: Frown, label: 'Not Great', color: 'bg-rose-100 text-rose-600 border-rose-200', activeColor: 'bg-rose-500 text-white' },
];

export default function QuickCheckIn({ user }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: (data) => base44.entities.CheckIn.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkIns'] });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedMood(null);
        setNote('');
        setShowNote(false);
      }, 3000);
    }
  });

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    checkInMutation.mutate({
      member_email: user.email,
      mood: selectedMood,
      note: note || undefined,
      date: today
    });
  };

  if (submitted) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-emerald-800">Check-in Sent!</h3>
          <p className="text-emerald-600 mt-2">Your family can see how you're doing</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-white overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">How are you feeling today?</h3>
        <p className="text-sm text-slate-500 mb-6">Tap to let your family know</p>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.value;
            return (
              <motion.button
                key={mood.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedMood(mood.value);
                  setShowNote(true);
                }}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  isSelected ? mood.activeColor : mood.color
                }`}
              >
                <Icon className="w-8 h-8" />
                <span className="text-xs font-medium">{mood.label}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showNote && selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Add a note for your family (optional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none border-slate-200 focus:border-violet-300 focus:ring-violet-200 rounded-xl text-base"
                rows={3}
              />
              <Button 
                onClick={handleSubmit}
                disabled={checkInMutation.isPending}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-6 text-lg font-medium"
              >
                {checkInMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Send className="w-5 h-5" />
                    </motion.div>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Check-in
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}