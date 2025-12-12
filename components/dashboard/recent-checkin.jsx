import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { Heart, Smile, ThumbsUp, Meh, Frown, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const moodConfig = {
  great: { icon: Smile, color: 'bg-emerald-100 text-emerald-600', label: 'Feeling great!' },
  good: { icon: ThumbsUp, color: 'bg-sky-100 text-sky-600', label: 'Feeling good' },
  okay: { icon: Meh, color: 'bg-amber-100 text-amber-600', label: 'Feeling okay' },
  not_great: { icon: Frown, color: 'bg-rose-100 text-rose-600', label: 'Not feeling great' },
};

export default function RecentCheckIns({ checkIns, familyMembers }) {
  const recentCheckIns = checkIns
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5);

  const getMemberName = (email) => {
    const member = familyMembers.find(m => m.email === email);
    return member?.full_name || email.split('@')[0];
  };

  if (recentCheckIns.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Family Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-8 text-slate-400">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No check-ins yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          Family Check-ins
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {recentCheckIns.map((checkIn, index) => {
            const config = moodConfig[checkIn.mood] || moodConfig.okay;
            const Icon = config.icon;
            
            return (
              <motion.div
                key={checkIn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-2xl bg-slate-50"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-800">
                        {getMemberName(checkIn.member_email)}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(checkIn.created_date), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{config.label}</p>
                    {checkIn.note && (
                      <p className="text-sm text-slate-500 mt-2 bg-white p-2 rounded-lg flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        {checkIn.note}
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