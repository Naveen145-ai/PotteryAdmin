import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

type Pot = {
  id: string;
  name: string;
  category: string;
};

export default function AdminDashboard() {
  const [pots, setPots] = useState<Pot[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPot, setEditingPot] = useState<Pot | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const handleSave = () => {
    if (!name || !category) return Alert.alert('All fields are required');

    if (editingPot) {
      setPots(prev =>
        prev.map(p => (p.id === editingPot.id ? { ...p, name, category } : p))
      );
    } else {
      const newPot: Pot = {
        id: Date.now().toString(),
        name,
        category,
      };
      setPots(prev => [...prev, newPot]);
    }

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setEditingPot(null);
    setModalVisible(false);
  };

  const handleEdit = (pot: Pot) => {
    setEditingPot(pot);
    setName(pot.name);
    setCategory(pot.category);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this pot?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => setPots(prev => prev.filter(p => p.id !== id)),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin - Manage Pots</Text>

      <FlatList
        data={pots}
        keyExtractor={item => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.potName}>{item.name}</Text>
            <Text style={styles.category}>📦 {item.category}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No pots added yet.</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>➕ Add New Pot</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{editingPot ? 'Edit Pot' : 'Add New Pot'}</Text>

          <TextInput
            placeholder="Pot Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Category (Clay, Color, Metal...)"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetForm}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f0ea',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  potName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  edit: {
    fontSize: 18,
  },
  delete: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalView: {
    marginTop: '50%',
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#ff3b30',
    fontWeight: '600',
    padding: 10,
  },
});
