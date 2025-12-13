import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { medications } from "@/entities/medicationData";
import { checkins } from "@/entities/checkinData";
import { Card } from "@/components/ui/card";

// Main DashboardCaretaker component
export default function DashboardCaretaker() {
  const [selectedElder, setSelectedElder] = useState("");
  const [medList, setMedList] = useState(medications);
  const [checkinList, setCheckinList] = useState(checkins);

  // Filtered arrays based on selected elder
  const filteredMeds = selectedElder
    ? medList.filter((m) => m.for_member === selectedElder)
    : medList;

  const filteredCheckins = selectedElder
    ? checkinList.filter((c) => c.member_email === selectedElder)
    : checkinList;

  const elders = Array.from(
    new Set([...medList.map((m) => m.for_member), ...checkinList.map((c) => c.member_email)])
  );

  // Add medication handler
  const handleAddMedication = () => {
    const name = prompt("Medication name:");
    const dosage = prompt("Dosage:");
    const instructions = prompt("Instructions:");
    const time_of_day = prompt("Time of day (morning, afternoon, evening, bedtime):");
    const icon = prompt("Icon or emoji:");
    const for_member = prompt("Elder email:");
    if (name && time_of_day && for_member) {
      setMedList([
        ...medList,
        { name, dosage, instructions, time_of_day, icon, for_member },
      ]);
    }
  };

  // Delete medication handler
  const handleDeleteMedication = (idx) => {
    const newList = [...medList];
    newList.splice(idx, 1);
    setMedList(newList);
  };

  // Delete checkin handler
  const handleDeleteCheckin = (idx) => {
    const newList = [...checkinList];
    newList.splice(idx, 1);
    setCheckinList(newList);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>FamilyCare Dashboard (Caretaker)</h1>

      {/* Elder filter */}
      <div style={{ margin: "20px 0" }}>
        <label>
          Filter by elder:{" "}
          <select
            value={selectedElder}
            onChange={(e) => setSelectedElder(e.target.value)}
          >
            <option value="">All</option>
            {elders.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Medications Section */}
      <section style={{ marginTop: 20 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          Medications
          <Button onClick={handleAddMedication}>+ Add</Button>
        </h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {filteredMeds.map((med, idx) => (
            <Card key={idx} style={{ padding: 10, minWidth: 200, position: "relative" }}>
              <h3>{med.icon} {med.name}</h3>
              <p>Dosage: {med.dosage}</p>
              <p>Time: {med.time_of_day}</p>
              <p>For: {med.for_member}</p>
              <ThreeDotMenu
                onDelete={() => handleDeleteMedication(idx)}
                onHistory={() => alert("History (placeholder)")}
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Check-ins Section */}
      <section style={{ marginTop: 40 }}>
        <h2>Check-ins</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {filteredCheckins.map((checkin, idx) => (
            <Card key={idx} style={{ padding: 10, minWidth: 200, position: "relative" }}>
              <p>{checkin.member_email}</p>
              <p>Mood: {checkin.mood}</p>
              <p>Note: {checkin.note || "—"}</p>
              <p>Date: {checkin.date}</p>
              <ThreeDotMenu
                onDelete={() => handleDeleteCheckin(idx)}
                onHistory={() => alert("History (placeholder)")}
              />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// Reusable 3-dot dropdown menu
function ThreeDotMenu({ onDelete, onHistory }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ position: "absolute", top: 5, right: 5 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          padding: "2px 5px",
        }}
      >
        ⋮
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: 25,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          <button
            style={{
              display: "block",
              padding: "5px 10px",
              width: "100%",
              textAlign: "left",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            onClick={() => { onHistory(); setOpen(false); }}
          >
            History
          </button>
          <button
            style={{
              display: "block",
              padding: "5px 10px",
              width: "100%",
              textAlign: "left",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "red",
            }}
            onClick={() => { onDelete(); setOpen(false); }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
