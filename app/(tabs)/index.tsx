import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function AdminPage() {
  const [pots, setPots] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const fetchPots = async () => {
  try {
    const res = await fetch("http://192.168.160.242:5000/api/v1/getAllPots");
    const data = await res.json();
    setPots(data.pots || []); // No success check, just set
  } catch (err) {
    console.log(err);
  }
};


  // Add pot
  const addPot = async () => {
    if (!name || !category || !price || !description || !image) {
      alert("All fields are required");
      return;
    }
    try {
      const res = await fetch("http://192.168.160.242:5000/api/v1/potAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, price, description, image }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Pot added!");
        fetchPots();
      } else {
        alert(data.message || "Error adding pot");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Update pot
  const updatePot = async (id) => {
    try {
      const res = await fetch(`http://192.168.160.242:5000/api/v1/updatePot/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, price, description, image }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Pot updated!");
        fetchPots();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Delete pot
  const deletePot = async (id) => {
    try {
      const res = await fetch(`http://192.168.160.242:5000/api/v1/deletePot/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Pot deleted!");
        fetchPots();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPots();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Pot Manager</Text>

      {/* Add Pot Form */}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Image URL" value={image} onChangeText={setImage} />
      <Button title="Add Pot" onPress={addPot} />

      {/* Pots List */}
      <FlatList
        data={pots}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.potItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.name}</Text>
            <Text>{item.category}</Text>
            <Text>₹{item.price}</Text>
            <TouchableOpacity onPress={() => updatePot(item._id)}>
              <Text style={styles.updateBtn}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deletePot(item._id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8, borderRadius: 5 },
  potItem: { marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5 },
  image: { width: 100, height: 100, marginBottom: 5 },
  updateBtn: { color: "blue", marginTop: 5 },
  deleteBtn: { color: "red", marginTop: 5 },
});
