import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient"; 
// import { Button, Input } from "@/components/ui";
import { medications } from "@/entities/medicationData";
import { checkins } from "@/entities/checkinData";
// import { Card } from "@/components/ui/card";

function Card({ children, style }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 6,
        border: "1px solid #ccc",
      }}
    />
  );
}



const currentElderEmail = "elder@example.com";


export default function DashboardElder() {
    const [medList, setMedList] = useState(medications);

    useEffect(() => {
        const fetchMedications = async () => {
          const { data: meds, error } = await supabase
            .from("medications")
            .select("*")
            .eq("elder_id", "a451f6a0-b42f-4f69-9cda-502f4a1e9575"); // currentElder's UUID
      
          if (error) {
            console.error("Error fetching medications:", error);
          } else {
            setMedList(meds);
          }
        };
      
        fetchMedications();
      }, []);
      

  const [checkinList, setCheckinList] = useState(
    checkins.filter((c) => c.member_email === currentElderEmail)
  );


  const [showAddMedication, setShowAddMedication] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    instructions: "",
    time_of_day: "",
    icon: "",
});


  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");

  const filteredMeds = medList.filter(
    (m) => m.for_member === currentElderEmail
  );
  
  

  const moodMap = {
    "😢": "not_great",
    "😕": "okay",
    "😶": "neutral",
    "🙂": "good",
    "😁": "great",
  };

  const handleSubmitCheckin = () => {
    if (!selectedMood) return;
    const newCheckin = {
      member_email: currentElderEmail,
      mood: moodMap[selectedMood],
      note: note || "—",
      date: new Date().toISOString().split("T")[0],
    };
    setCheckinList([...checkinList, newCheckin]);
    setSelectedMood("");
    setNote("");
  };

  const handleAddMedication = () => {
    const name = prompt("Medication name:");
    const dosage = prompt("Dosage:");
    const instructions = prompt("Instructions:");
    const time_of_day = prompt("Time of day (morning, afternoon, evening, bedtime):");
    const icon = prompt("Icon or emoji:");
    if (name && time_of_day) {
      setMedList([
        ...medList,
        { name, dosage, instructions, time_of_day, icon, for_member: currentElderEmail },
      ]);
    }
  };

  const handleDeleteMedication = (idx) => {
    const newList = [...medList];
    newList.splice(idx, 1);
    setMedList(newList);
  };

  const handleDeleteCheckin = (idx) => {
    const newList = [...checkinList];
    newList.splice(idx, 1);
    setCheckinList(newList);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>FamilyCare Dashboard (Elder)</h1>

      {/* Medications Section */}
      <section style={{ marginTop: 40 }}>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h2>Medications</h2>
    <Button onClick={() => setShowAddMedication(!showAddMedication)}>
      + Add
    </Button>
  </div>

  {/* Add Medication Form */}
  {showAddMedication && (
    <Card style={{ padding: 16, marginTop: 16, maxWidth: 400 }}>
      <h3>Add Medication</h3>

      <Input
        placeholder="Medication name"
        value={newMedication.name}
        onChange={(e) =>
          setNewMedication({ ...newMedication, name: e.target.value })
        }
        style={{ marginBottom: 8 }}
      />

      <Input
        placeholder="Dosage"
        value={newMedication.dosage}
        onChange={(e) =>
          setNewMedication({ ...newMedication, dosage: e.target.value })
        }
        style={{ marginBottom: 8 }}
      />

      <Input
        placeholder="Instructions"
        value={newMedication.instructions}
        onChange={(e) =>
          setNewMedication({
            ...newMedication,
            instructions: e.target.value,
          })
        }
        style={{ marginBottom: 8 }}
      />

      <Input
        placeholder="Time of day (morning / afternoon / evening / bedtime)"
        value={newMedication.time_of_day}
        onChange={(e) =>
          setNewMedication({
            ...newMedication,
            time_of_day: e.target.value,
          })
        }
        style={{ marginBottom: 8 }}
      />

      <Input
        placeholder="Icon (emoji)"
        value={newMedication.icon}
        onChange={(e) =>
          setNewMedication({ ...newMedication, icon: e.target.value })
        }
        style={{ marginBottom: 12 }}
      />

      <Button
        style={{ width: "100%" }}
        onClick={() => {
          if (!newMedication.name || !newMedication.time_of_day) return;

          setMedList([
            ...medList,
            {
              ...newMedication,
              for_member: currentElderEmail,
            },
          ]);

          setNewMedication({
            name: "",
            dosage: "",
            instructions: "",
            time_of_day: "",
            icon: "",
          });

          setShowAddMedication(false);
        }}
      >
        Save Medication
      </Button>
    </Card>
  )}

  {/* Medication Cards */}
  <div
    style={{
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginTop: 20,
    }}
  >
    {filteredMeds.map((med, idx) => (
      <Card
        key={idx}
        style={{ padding: 10, minWidth: 200, position: "relative" }}
      >
        <h3>
          {med.icon} {med.name}
        </h3>
        <p>Dosage: {med.dosage}</p>
        <p>Time: {med.time_of_day}</p>

        <ThreeDotMenu
          onDelete={() =>
            setMedList(medList.filter((_, i) => i !== idx))
          }
          onHistory={() => alert("History (placeholder)")}
        />
      </Card>
    ))}
  </div>
</section>


      {/* Check-ins Section */}
        <section style={{ marginTop: 40 }}>
        <h2>Check-ins</h2>

        {/* Mood Buttons */}
        <div
            style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            }}
        >
            {["😢", "😕", "😶", "🙂", "😁"].map((emoji) => (
            <button
                key={emoji}
                onClick={() => setSelectedMood(emoji)}
                style={{
                flex: 1,
                height: 90,
                fontSize: 36,
                borderRadius: 12,
                cursor: "pointer",
                background: "#f5f5f5",
                border:
                    selectedMood === emoji
                    ? "3px solid #3b82f6" // blue outline
                    : "2px solid #ddd",
                outline: "none",
                }}
            >
                {emoji}
            </button>
            ))}
        </div>

        {/* Note Input (only if mood selected) */}
        {selectedMood && (
            <div style={{ marginBottom: 24 }}>
            <Input
                placeholder="Add a note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                width: "100%",
                height: 48,
                fontSize: 16,
                }}
            />
            </div>
        )}

        {/* Submit Button */}
        {selectedMood && (
            <Button
            style={{
                width: "100%",
                height: 52,
                fontSize: 18,
            }}
            onClick={handleSubmitCheckin}
            >
            Submit Check-in
            </Button>
        )}

        {/* Previous Check-ins */}
        <div
            style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 32,
            }}
        >
            {checkinList.map((checkin, idx) => (
            <Card
                key={idx}
                style={{
                padding: 12,
                minWidth: 220,
                position: "relative",
                }}
            >
                <p>Mood: {checkin.mood}</p>
                <p>Note: {checkin.note}</p>
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

// Reusable 3-dot menu
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
