"use client"
import React, {useState} from 'react'
import {Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription} from '@/components/ui/dialog'

const AddToPantryModal = ({ isOpen, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState("scan");
    const [selectedImage, setSelectedImage] = useState(null);
    const [scannedIngredients, setScannedIngredients] = useState([]);
    const [manualItem, setManualItem] = useState({name: "", quantity: ""})
    
    const handleClose = () => {
        //reset all states
        setActiveTab("scan")
        setSelectedImage(null)
        setScannedIngredients([])
        setManualItem({name: "", quantity: ""})
        onClose()
    }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        {/* for smooth animation */}
      <DialogContent className="sm:max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out">
        <DialogHeader>
          <DialogTitle>Add to Pantry</DialogTitle>
          <DialogDescription>
            Add this ingredient to your pantry list.
          </DialogDescription>
        </DialogHeader>

        {/* Your form or content here */}

      </DialogContent>
    </Dialog>
  );
};

export default AddToPantryModal;