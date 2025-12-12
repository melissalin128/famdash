import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Sun, Sunset, Moon, Trash2, Edit2, X, Check } from 'lucide-react';

const timeSlots = [
  { key: 'morning', label: 'Morning', icon: Sun, color: 'bg-amber-100 text-amber-600' },
  { key: 'afternoon', label: 'Afternoon', icon: Sun, color: 'bg-orange-100 text-orange-600' },
  { key: 'evening', label: 'Evening', icon: Sunset, color: 'bg-purple-100 text-purple-600' },
  { key: 'bedtime', label: 'Bedtime', icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
];

const emojiOptions = ['💊', '💉', '🩹', '💧', '🌿', '❤️', '🧪', '💜'];

export default function Medications() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    instructions: '',
    time_of_day: 'morning',
    icon: '💊'
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: () => base44.entities.Medication.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Medication.create({ ...data, for_member: user.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Medication.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Medication.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      instructions: '',
      time_of_day: 'morning',
      icon: '💊'
    });
    setEditingMed(null);
    setIsOpen(false);
  };

  const handleEdit = (med) => {
    setFormData({
      name: med.name,
      dosage: med.dosage || '',
      instructions: med.instructions || '',
      time_of_day: med.time_of_day,
      icon: med.icon || '💊'
    });
    setEditingMed(med);
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    if (editingMed) {
      updateMutation.mutate({ id: editingMed.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const groupedMeds = timeSlots.map(slot => ({
    ...slot,
    medications: medications.filter(m => m.time_of_day === slot.key)
  }));

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Pill className="w-8 h-8 text-violet-500" />
              Medications
            </h1>
            <p className="text-slate-500 mt-1">Manage daily medications</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-6 text-base shadow-lg shadow-violet-200">
                <Plus className="w-5 h-5 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingMed ? 'Edit Medication' : 'Add New Medication'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-base">Choose an icon</Label>
                  <div className="flex gap-2 flex-wrap">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setFormData({ ...formData, icon: emoji })}
                        className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                          formData.icon === emoji 
                            ? 'bg-violet-100 border-2 border-violet-400 scale-110' 
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Medication Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Aspirin, Vitamin D"
                    className="rounded-xl py-6 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Dosage</Label>
                  <Input
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 100mg, 2 tablets"
                    className="rounded-xl py-6 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">When to take *</Label>
                  <Select
                    value={formData.time_of_day}
                    onValueChange={(val) => setFormData({ ...formData, time_of_day: val })}
                  >
                    <SelectTrigger className="rounded-xl py-6 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(slot => {
                        const Icon = slot.icon;
                        return (
                          <SelectItem key={slot.key} value={slot.key} className="py-3">
                            <span className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {slot.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Special Instructions</Label>
                  <Input
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="e.g., Take with food"
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
                    disabled={createMutation.isPending || updateMutation.isPending || !formData.name.trim()}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-6"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {editingMed ? 'Save Changes' : 'Add Medication'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Medications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : medications.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Pill className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No medications yet</h3>
              <p className="text-slate-500 mb-6">Add your first medication to get started</p>
              <Button
                onClick={() => setIsOpen(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Medication
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {groupedMeds.filter(group => group.medications.length > 0).map(group => {
              const Icon = group.icon;
              return (
                <div key={group.key}>
                  <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${group.color.split(' ')[1]}`}>
                    <Icon className="w-5 h-5" />
                    {group.label}
                  </h2>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {group.medications.map((med) => (
                        <motion.div
                          key={med.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                        >
                          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
                            <CardContent className="p-5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`w-14 h-14 rounded-2xl ${group.color.split(' ')[0]} flex items-center justify-center text-3xl`}>
                                    {med.icon || '💊'}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg text-slate-800">{med.name}</h3>
                                    {med.dosage && (
                                      <p className="text-slate-600">{med.dosage}</p>
                                    )}
                                    {med.instructions && (
                                      <p className="text-sm text-slate-400 mt-1">{med.instructions}</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(med)}
                                    className="text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl"
                                  >
                                    <Edit2 className="w-5 h-5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteMutation.mutate(med.id)}
                                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}