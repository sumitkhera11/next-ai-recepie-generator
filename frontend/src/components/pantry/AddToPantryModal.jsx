"use client"
import { useState, useEffect } from "react";

import ImageUploader from "@/components/pantry/ImageUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { X, Camera, Upload, Plus, Check, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { addPantryItemsManually, scanPantryImage, saveToPantry } from "@/actions/pantry.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { usePantryModal } from "@/context/PantryModalContext";

// Added showTrigger prop with a default value of true
export default function AddToPantryModal({ showTrigger = true }) {

  const { open, setOpen } = usePantryModal();
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [manualItem, setManualItem] = useState({ name: "", quantity: "" });
  const [activeTab, setActiveTab] = useState("scan");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const handleClose = () => {
    setActiveTab("scan");
    setSelectedImage(null);
    setScannedIngredients([]);
    setManualItem({ name: "", quantity: "" });
    setOpen(false);
  };
  
  const handleImageChange = (file) => {
    setSelectedImage(file);
    setScannedIngredients([]); 
  }

  const handleScan = async () => {
    if (!selectedImage) return;
    try {
      setScanning(true);
      const formData = new FormData();
      formData.append("image", selectedImage);
      const result = await scanPantryImage(formData);
      if (result?.success) {
        setScannedIngredients(result.ingredients);
        toast.success(`Found ${result.ingredients.length} ingredients!`)
      }
    } catch (error) {
      toast.error("Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const handleSaveScanned = async () => {
    if (scannedIngredients.length === 0) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("ingredients", JSON.stringify(scannedIngredients));
      const result = await saveToPantry(formData);
      if (result.success) {
        router.refresh();
        toast.success(result.message);
        handleClose();
      } else {
        toast.error(result.message || "Failed to save");
      }
    } catch (error) {
      console.error("SAVE ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const removeIngredient = (index) => {
    setScannedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!manualItem.name.trim() || !manualItem.quantity.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append("name", manualItem.name);
      formData.append("quantity", manualItem.quantity);
      const result = await addPantryItemsManually(formData);
      if (result.success) {
        router.refresh();
        toast.success(result.message || "Item added to pantry");
        handleClose();
      } else {
        toast.error(result.message || "Failed to add item");
      }
    } catch (error) {
      console.error("CLIENT ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      {/* Conditionally render the trigger button */}
      {showTrigger && (
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="hidden md:flex bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add to Pantry
        </Button>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) handleClose(); // Ensure state resets when clicking outside/closing
          setOpen(v);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-orange-600">
              Add to Pantry
            </DialogTitle>
            <DialogDescription>
              Scan ingredients or add manually.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan">
                <Camera className="w-4 h-4 mr-2" />
                AI Scan Image
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Plus className="w-4 h-4 mr-2" />
                Add Manually
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="space-y-6 mt-6">
              {scannedIngredients.length === 0 ? (
                <div className="space-y-4">
                  <ImageUploader onImageSelect={handleImageChange} loading={scanning} />
                  {selectedImage && !scanning && (
                    <Button
                      onClick={handleScan}
                      className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700"
                      disabled={scanning}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Scan Image
                    </Button>
                  )}
                  {scanning && (
                    <Button disabled className="w-full h-12 text-lg">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">Review Detected Items</h3>
                      <p className="text-sm text-stone-600">Found {scannedIngredients.length} ingredients</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setScannedIngredients([]); setSelectedImage(null); }} className="gap-2">
                      <Camera className="w-4 h-4" />
                      Scan Again
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {scannedIngredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="flex-1">
                          <div className="font-medium text-stone-900">{ingredient.name}</div>
                          <div className="text-sm text-stone-500">{ingredient.quantity}</div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeIngredient(index)} className="text-stone-600 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSaveScanned} disabled={saving || scannedIngredients.length === 0} className="bg-green-600 hover:bg-green-700 text-white h-12 w-full">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 mr-2" />}
                    Save Items to Pantry
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="manual" className="mt-6">
              <form onSubmit={handleAddManual} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Ingredient Name</label>
                  <input
                    type="text" required value={manualItem.name}
                    onChange={(e) => setManualItem({ ...manualItem, name: e.target.value })}
                    placeholder="e.g. Tomato, Paneer"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    disabled={adding}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Quantity</label>
                  <input
                    type="text" required value={manualItem.quantity}
                    onChange={(e) => setManualItem({ ...manualItem, quantity: e.target.value })}
                    placeholder="e.g. 200g"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    disabled={adding}
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-orange-600 hover:bg-orange-700" disabled={adding}>
                  {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
                  Add Item
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}