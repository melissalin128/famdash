import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Star, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmergencyContacts({ contacts }) {
  const sortedContacts = [...contacts].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {sortedContacts.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <Phone className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No emergency contacts added</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    contact.is_primary 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-800">{contact.name}</h4>
                      {contact.is_primary && (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{contact.relationship}</p>
                  </div>
                  <span className="text-rose-600 font-medium group-hover:underline">
                    {contact.phone}
                  </span>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}