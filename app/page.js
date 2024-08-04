"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { doc, collection, deleteDoc, getDoc, getDocs, query, setDoc, addDoc } from "firebase/firestore";
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  
  const [itemName, setItemName] = useState("");
  const [itemCount, setItemCount] = useState("");
  const [toUpdateId, setToUpdateId] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        name: doc.name,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
  };

  const addItem = async (newName) => {
    const docRef = await addDoc(collection(firestore, "inventory"), {name: newName, count: 1});
    await updateInventory();
  };

  const plusOne = async (id) => {
    const docRef = doc(collection(firestore, "inventory"), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { ...docSnap.data(), count: count + 1 });
    } 

    await updateInventory();
  }

  const removeItem = async (id) => {
    const docRef = doc(collection(firestore, "inventory"), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();

      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { ...docSnap.data(), count: count - 1 });
      }
    }

    await updateInventory();
  };

  const updateItem = async (id, newItem) => {
    const docRef = doc(collection(firestore, "inventory"), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap);
      console.log(newItem);
      await setDoc(docRef, newItem);
    }

    await updateInventory();
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleOpenUpdateModal = (id) => {setToUpdateId(id); setOpenUpdateModal(true);}
  const handleCloseUpdateModal = () => setOpenUpdateModal(false);

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}>

      {/* Modal: add item form */}
      <Modal
        open={openAddModal}
        onClose={handleCloseAddModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack
            width="100%"
            direction="row"
            spacing="2"
          >
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}></TextField>

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleCloseAddModal();
              }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}>
          <Typography variant="h6">Update Item</Typography>
          <Stack
            width="100%"
            direction="row"
            spacing="2"
          >
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}></TextField>

            <TextField
              variant="outlined"
              fullWidth
              value={itemCount}
              onChange={(e) => {
                setItemCount(e.target.value);
              }}></TextField>

            <Button
              variant="outlined"
              onClick={() => {
                updateItem(toUpdateId, {name: itemName, count: parseInt(itemCount)});
                setItemName("");
                setItemCount("");
                handleCloseUpdateModal();
              }}>
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/***** MAIN CONTENT *****/}
      <Typography variant="h1"> Pantry Tracker </Typography>

      <Button
        variant="contained"
        onClick={() => {
          handleOpenAddModal();
        }}>
        Add New Item
      </Button>

      {/* Display Box */}
      <Box border="1px solid #333" width="90%">
        <Box
          height="90px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Typography
            variant="h2"
            color="#333">
            Inventory Items
          </Typography>
        </Box>

        <Stack
          height="400px"
          spacing={2}
          overflow="auto">
          {inventory.map(({ id, name, count }) => {
            return (
              <Box
                key={id}
                width="100%"
                minHeight="100px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography
                  variant="h4"
                  color="#333"
                  textAlign="center">
                  {name}
                </Typography>

                <Typography
                  variant="h4"
                  color="#333"
                  textAlign="center">
                  {count}
                </Typography>

                <Box width='41%' display='flex' flexDirection='row' justifyContent='space-between'>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleOpenUpdateModal(id);
                    }}>
                    update
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      plusOne(id);
                    }}>
                    +1
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(id);
                    }}>
                    -1
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
