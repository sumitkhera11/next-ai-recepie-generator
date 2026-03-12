// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogHeader,
//   DialogDescription,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { Camera, Upload, Plus } from "lucide-react";

// export default function AddToPantryModal() {
//   const [open, setOpen] = useState(false);
//   // const [activeTab, setActiveTab] = useState("scan");
//   // const [selectedImage, setSelectedImage] = useState(null);
//   // const [scannedIngredients, setScannedIngredients] = useState([]);
//   // const [manualItem, setManualItem] = useState({ name: "", quantity: "" });

//   const handleClose = () => {
//     // setActiveTab("scan");
//     // setSelectedImage(null);
//     // setScannedIngredients([]);
//     // setManualItem({ name: "", quantity: "" });
//     onClose();
//   };

//   // const handleImageChange = (e) => {
//   //   const file = e.target.files?.[0];
//   //   if (file) {
//   //     setSelectedImage(URL.createObjectURL(file));
//   //   }
//   // };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-md">

//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold text-orange-600">
//             Add to Pantry
//           </DialogTitle>

//           <DialogDescription>
//             Scan ingredients from an image or add manually.
//           </DialogDescription>
//         </DialogHeader>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-4">

//           <Button
//             variant={activeTab === "scan" ? "default" : "outline"}
//             className="flex-1"
//             onClick={() => setActiveTab("scan")}
//           >
//             Scan Image
//           </Button>

//           <Button
//             variant={activeTab === "manual" ? "default" : "outline"}
//             className="flex-1"
//             onClick={() => setActiveTab("manual")}
//           >
//             Add Manually
//           </Button>

//         </div>

//         {/* Scan Tab */}
//         {activeTab === "scan" && (
//           <div className="space-y-4">

//             <label className="border-2 border-dashed border-orange-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition">

//               <Camera className="w-8 h-8 text-orange-500 mb-2" />

//               <span className="text-sm text-stone-600">
//                 Upload pantry image
//               </span>

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />

//             </label>

//             {selectedImage && (
//               <img
//                 src={selectedImage}
//                 alt="preview"
//                 className="rounded-lg"
//               />
//             )}

//             <Button className="w-full bg-orange-600 hover:bg-orange-700">
//               Scan Ingredients
//             </Button>

//           </div>
//         )}

//         {/* Manual Tab */}
//         {activeTab === "manual" && (
//           <div className="space-y-4">

//             <input
//               type="text"
//               placeholder="Ingredient name"
//               value={manualItem.name}
//               onChange={(e) =>
//                 setManualItem({ ...manualItem, name: e.target.value })
//               }
//               className="w-full border rounded-md p-2"
//             />

//             <input
//               type="text"
//               placeholder="Quantity (e.g. 2 tomatoes)"
//               value={manualItem.quantity}
//               onChange={(e) =>
//                 setManualItem({ ...manualItem, quantity: e.target.value })
//               }
//               className="w-full border rounded-md p-2"
//             />

//             <Button className="w-full bg-orange-600 hover:bg-orange-700">
//               <Plus className="w-4 h-4 mr-2" />
//               Add Item
//             </Button>

//           </div>
//         )}

//       </DialogContent>
//     </Dialog>
//   );
// }
"use client"

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ImageUploader from "@/components/pantry/ImageUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Camera, Upload, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { addPantryItemsManually, scanPantryImage } from "@/actions/pantry.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddToPantryModal() {

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [manualItem, setManualItem] = useState({ name: "", quantity: "" });
  const [adding, setAdding] = useState(false);
  // adding = true  → disable form
  // adding = false → enable form

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
    setScannedIngredients([]);//Reset when new image selected
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
        toast.success(`Found ${scannedIngredients.length} ingredients!`)
      }

    } catch (error) {
      toast.error("Scan failed");
    } finally {
      setScanning(false);
    }
  };
  
  const handleAddManual = async (e) => {
    e.preventDefault();

    try {
      setAdding(true);

      const formData = new FormData();
      formData.append("name", manualItem.name);
      formData.append("quantity", manualItem.quantity);

      const result = await addPantryItemsManually(formData);

      if (result.success) {
        router.refresh();   // ⭐ THIS LINE
        toast.success("Item added to pantry");
        handleClose();
      }

    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="hidden md:flex bg-orange-600 hover:bg-orange-700"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add to Pantry
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">

          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-orange-600">
              Add to Pantry
            </DialogTitle>

            <DialogDescription>
              Scan ingredients or add manually.
            </DialogDescription>
          </DialogHeader>

          {/* content here */}
          {/* Tabs */}
          <Tabs defaultValue="scan" className="w-full mb-4">

            <TabsList className="grid w-full grid-cols-2">

              <TabsTrigger value="scan">
                <Camera className="w-4 h-4" />
                AI Scan Image
              </TabsTrigger>

              <TabsTrigger value="manual">
                <Plus className="w-4 h-4" />
                Add Manually
              </TabsTrigger>

            </TabsList>

            <TabsContent value="scan" className="space-y-6 mt-6">

              {scannedIngredients.length === 0 ?
                (<div className="space-y-4">
                  <ImageUploader onImageSelect={handleImageChange} loading={scanning} />
                  {selectedImage && !scanning && (
                    <Button
                      onClick={handleScan}
                      variant="primary"
                      className="w-full  h-12 text-lg"
                      disabled={scanning}
                    >
                      {scanning ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Scan Image
                        </>
                      )
                      }

                    </Button>
                  )}
                </div>) :
                (
                  // Step 2: Review & Save
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-stone-900">
                          Review Detected Items
                        </h3>
                        <p className="text-sm text-stone-600">
                          Found {scannedIngredients.length} ingredients
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setScannedIngredients([]);
                          setSelectedImage(null);
                        }}
                        className="gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Scan Again
                      </Button>
                    </div>

                    {/* Ingredients List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {scannedIngredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-stone-900">
                              {ingredient.name}
                            </div>
                            <div className="text-sm text-stone-500">
                              {ingredient.quantity}
                            </div>
                          </div>
                          {ingredient.confidence && (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-700 border-green-200"
                            >
                              {Math.round(ingredient.confidence * 100)}%
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeIngredient(index)}
                            className="text-stone-600 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={handleSaveScanned}
                      disabled={saving || scannedIngredients.length === 0}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 w-full"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Save {scannedIngredients.length} Items to Pantry
                        </>
                      )}
                    </Button>
                  </div>
                )}
            </TabsContent>

            <TabsContent value="manual" className="mt-6">

              <form onSubmit={handleAddManual} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Ingredient Name
                  </label>

                  <input
                    type="text"
                    value={manualItem.name}
                    onChange={(e) =>
                      setManualItem({
                        ...manualItem,
                        name: e.target.value
                      })
                    }
                    placeholder="e.g. Chicken breast"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={adding}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Quantity
                  </label>

                  <input
                    type="text"
                    value={manualItem.quantity}
                    onChange={(e) =>
                      setManualItem({
                        ...manualItem,
                        quantity: e.target.value
                      })
                    }
                    placeholder="e.g. 2 pieces"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={adding}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 h-12 w-full"
                  disabled={adding}
                >
                  {adding ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Item
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

        </DialogContent>
      </Dialog>
    </>
  );
}