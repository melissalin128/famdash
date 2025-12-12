import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Plus, Star, Trash2, Edit2, AlertCircle, Check } from 'lucide-react';

export default function Contacts() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    is_primary: false
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['emergencyContacts'],
    queryFn: () => base44.entities.EmergencyContact.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.EmergencyContact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EmergencyContact.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.EmergencyContact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      is_primary: false
    });
    setEditingContact(null);
    setIsOpen(false);
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship || '',
      phone: contact.phone,
      is_primary: contact.is_primary || false
    });
    setEditingContact(contact);
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim()) return;
    
    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.name.localeCompare(b.name);
  });

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
              <AlertCircle className="w-8 h-8 text-rose-500" />
              Emergency Contacts
            </h1>
            <p className="text-slate-500 mt-1">Important contacts for emergencies</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-6 text-base shadow-lg shadow-rose-200">
                <Plus className="w-5 h-5 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label className="text-base">Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Dr. Smith, John (Son)"
                    className="rounded-xl py-6 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Relationship</Label>
                  <Input
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Family Doctor, Son, Pharmacy"
                    className="rounded-xl py-6 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Phone Number *</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., (555) 123-4567"
                    className="rounded-xl py-6 text-base"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                  <div>
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      Primary Contact
                    </Label>
                    <p className="text-sm text-slate-500 mt-1">
                      Shows at the top of the list
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_primary}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_primary: checked })}
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
                    disabled={createMutation.isPending || updateMutation.isPending || !formData.name.trim() || !formData.phone.trim()}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-6"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {editingContact ? 'Save Changes' : 'Add Contact'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contacts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Phone className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No contacts yet</h3>
              <p className="text-slate-500 mb-6">Add important contacts for quick access</p>
              <Button
                onClick={() => setIsOpen(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {sortedContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-0 shadow-md hover:shadow-lg transition-all ${
                    contact.is_primary ? 'ring-2 ring-rose-200' : ''
                  }`}>
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        <div className={`w-2 ${contact.is_primary ? 'bg-rose-500' : 'bg-slate-200'}`} />
                        <div className="flex-1 p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                contact.is_primary 
                                  ? 'bg-rose-500 text-white' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                <Phone className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg text-slate-800">{contact.name}</h3>
                                  {contact.is_primary && (
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                  )}
                                </div>
                                {contact.relationship && (
                                  <p className="text-slate-500">{contact.relationship}</p>
                                )}
                                <a 
                                  href={`tel:${contact.phone}`}
                                  className="text-rose-600 font-medium hover:underline text-lg"
                                >
                                  {contact.phone}
                                </a>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${contact.phone}`}
                                className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-xl transition-colors"
                              >
                                <Phone className="w-5 h-5" />
                              </a>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(contact)}
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
                              >
                                <Edit2 className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMutation.mutate(contact.id)}
                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
