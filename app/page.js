'use client'

import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { collection, getDocs, query } from "firebase/firestore";
import { Box, Typography } from "@mui/material";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState({});
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    
    setInventory(inventoryList);
  }

  useEffect(() => {
    updateInventory();
  }, []);


  return (
    <Box>
      <Typography variant="h1"> Pantry Tracker </Typography>
      {
        inventory.map((item) => {
          console.log(item)
          return (
            <div>
              {item.name}
              {item.count}
            </div>
          )
        })
      }
    </Box>
  )
}
