// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { checkins } from "@/entities/checkinData";
import { Card } from "@/components/ui/card";
import { medications as initialMedications } from "@/entities/medicationData";

export default function Dashboard() {
  const [medications, setMedications] = useState(initialMedications);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    time_of_day: "",
    for_member: "",
    icon: "💊",
  });
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleAddMedication = () => {
    if (!newMed.name.trim()) return;

    setMedications([...medications, newMed]);
    setNewMed({
      name: "",
      dosage: "",
      time_of_day: "morning",
      for_member: "",
      icon: "💊",
    });
    setOpenAddForm(false);
  };

  const handleDeleteMedication = (index) => {
    setMedications(medications.filter((_, idx) => idx !== index));
    setOpenDropdownIndex(null);
  };

  const handleEditMedication = (index) => {
    setEditingIndex(index);
    setEditValues({ ...medications[index] });
    setOpenDropdownIndex(null);
  };

  const handleSaveEdit = (index) => {
    setMedications(
      medications.map((med, idx) => (idx === index ? editValues : med))
    );
    setEditingIndex(null);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>FamilyCare Dashboard</h1>

      <section style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2>Medications</h2>
          <Button
            style={{ fontSize: 14, padding: "4px 8px" }}
            onClick={() => setOpenAddForm(!openAddForm)}
          >
            + Add
          </Button>
        </div>

        {openAddForm && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              padding: 10,
              marginTop: 10,
              border: "1px solid #ccc",
              borderRadius: 6,
              maxWidth: 300,
            }}
          >
            <Input
              placeholder="Name"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <Input
              placeholder="Dosage"
              value={newMed.dosage}
              onChange={(e) =>
                setNewMed({ ...newMed, dosage: e.target.value })
              }
            />
            <Input
              placeholder="Time of Day (morning, afternoon, evening, bedtime)"
              value={newMed.time_of_day}
              onChange={(e) =>
                setNewMed({ ...newMed, time_of_day: e.target.value })
              }
            />
            <Input
              placeholder="For Member"
              value={newMed.for_member}
              onChange={(e) =>
                setNewMed({ ...newMed, for_member: e.target.value })
              }
            />
            <Input
              placeholder="Icon (emoji)"
              value={newMed.icon}
              onChange={(e) => setNewMed({ ...newMed, icon: e.target.value })}
            />
            <Button style={{ marginTop: 5 }} onClick={handleAddMedication}>
              Save
            </Button>
            <Button
              style={{ marginTop: 5 }}
              onClick={() => setOpenAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}
        >
          {medications.map((med, idx) => (
            <Card
              key={idx}
              style={{ padding: 10, minWidth: 200, position: "relative" }}
            >
              {/* 3-dot menu */}
              <div style={{ position: "absolute", top: 5, right: 5 }}>
                <Button
                  style={{ padding: "2px 6px" }}
                  onClick={() =>
                    setOpenDropdownIndex(openDropdownIndex === idx ? null : idx)
                  }
                >
                  ⋮
                </Button>
                {openDropdownIndex === idx && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      zIndex: 10,
                    }}
                  >
                    <Button
                      style={{
                        padding: "4px 10px",
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                      }}
                      onClick={() => handleEditMedication(idx)}
                    >
                      Edit
                    </Button>
                    <Button
                      style={{
                        padding: "4px 10px",
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                      }}
                      onClick={() => handleDeleteMedication(idx)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              {editingIndex === idx ? (
                <div>
                  <Input
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                    placeholder="Name"
                  />
                  <Input
                    value={editValues.dosage}
                    onChange={(e) =>
                      setEditValues({ ...editValues, dosage: e.target.value })
                    }
                    placeholder="Dosage"
                  />
                  <Input
                    value={editValues.time_of_day}
                    onChange={(e) =>
                      setEditValues({ ...editValues, time_of_day: e.target.value })
                    }
                    placeholder="Time of Day"
                  />
                  <Input
                    value={editValues.for_member}
                    onChange={(e) =>
                      setEditValues({ ...editValues, for_member: e.target.value })
                    }
                    placeholder="For Member"
                  />
                  <Input
                    value={editValues.icon}
                    onChange={(e) =>
                      setEditValues({ ...editValues, icon: e.target.value })
                    }
                    placeholder="Icon"
                  />
                  <Button
                    style={{ marginTop: 5 }}
                    onClick={() => handleSaveEdit(idx)}
                  >
                    Save
                  </Button>
                  <Button
                    style={{ marginTop: 5, marginLeft: 5 }}
                    onClick={() => setEditingIndex(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div>
                  <h3>
                    {med.icon} {med.name}
                  </h3>
                  <p>Dosage: {med.dosage}</p>
                  <p>Time: {med.time_of_day}</p>
                  <p>For: {med.for_member}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Check-ins</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {checkins.map((checkin, idx) => (
            <Card key={idx} style={{ padding: 10, minWidth: 200 }}>
              <p>{checkin.member_email}</p>
              <p>Mood: {checkin.mood}</p>
              <p>Note: {checkin.note || "—"}</p>
              <p>Date: {checkin.date}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
