import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, Pin, Trash2, Send, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function FamilyNotes({ notes, user }) {
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FamilyNote.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyNotes'] });
      setNewNote('');
      setShowForm(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FamilyNote.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyNotes'] });
    }
  });

  const togglePinMutation = useMutation({
    mutationFn: ({ id, is_pinned }) => base44.entities.FamilyNote.update(id, { is_pinned: !is_pinned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyNotes'] });
    }
  });

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_date) - new Date(a.created_date);
  }).slice(0, 6);

  const handleSubmit = () => {
    if (!newNote.trim()) return;
    createMutation.mutate({
      content: newNote,
      author_name: user.full_name || user.email.split('@')[0],
      is_pinned: false
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-amber-500" />
            Family Notes
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <Textarea
                placeholder="Write a note for your family..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="resize-none border-amber-200 focus:border-amber-300 focus:ring-amber-200 rounded-xl text-base mb-3"
                rows={3}
              />
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || !newNote.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Note
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {sortedNotes.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No notes yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-2xl relative group ${
                  note.is_pinned ? 'bg-amber-50 border-2 border-amber-200' : 'bg-slate-50'
                }`}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => togglePinMutation.mutate({ id: note.id, is_pinned: note.is_pinned })}
                    className={`p-1.5 rounded-lg hover:bg-white ${note.is_pinned ? 'text-amber-600' : 'text-slate-400'}`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(note.id)}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-700 pr-16">{note.content}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                  <span>{note.author_name}</span>
                  <span>{formatDistanceToNow(new Date(note.created_date), { addSuffix: true })}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}