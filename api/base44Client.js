export const base44 = {
  auth: {
    me: async () => ({ full_name: 'Demo User' })
  },
  entities: {
    Medication: { list: async () => [] },
    MedicationLog: { filter: async () => [] },
    CalendarEvent: { list: async () => [] },
    CheckIn: { list: async () => [] },
    EmergencyContact: { list: async () => [] },
    FamilyNote: { list: async () => [] },
    User: { list: async () => [] }
  }
};
