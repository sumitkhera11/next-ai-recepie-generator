"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

import { Edit2, Trash2, Check, X, Loader2 } from "lucide-react";
import { deletePantryItem, updatePantryItem } from "@/actions/pantry.actions";
import { toast } from "sonner";

export default function PantryGrid({ items }) {

  /* ----------------------------- */
  /* STATE */
  /* ----------------------------- */

  const [pantryItems, setPantryItems] = useState(items);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [editValues, setEditValues] = useState({
    name: "",
    quantity: ""
  });

  /* ----------------------------- */
  /* SYNC SERVER DATA */
  /* ----------------------------- */

  useEffect(() => {
    setPantryItems(items);
  }, [items]);

  /* ----------------------------- */
  /* START EDIT */
  /* ----------------------------- */

  const startEdit = (item) => {
    setEditingId(item.id);

    setEditValues({
      name: item.name,
      quantity: item.quantity
    });
  };

  /* ----------------------------- */
  /* SAVE EDIT */
  /* ----------------------------- */

  const handleSave = async (item) => {

    const formData = new FormData();

    formData.append("itemId", item.documentId);
    formData.append("name", editValues.name);
    formData.append("quantity", editValues.quantity);

    try {

      await updatePantryItem(formData);

      /* optimistic update */

      setPantryItems(prev =>
        prev.map(i =>
          i.id === item.id
            ? { ...i, name: editValues.name, quantity: editValues.quantity }
            : i
        )
      );

      toast.success("Item updated");
      setEditingId(null);

    } catch (error) {

      toast.error("Update failed");

    }
  };

  /* ----------------------------- */
  /* DELETE ITEM */
  /* ----------------------------- */

  const handleDelete = async (item) => {

    try {

      setDeletingId(item.id);

      /* optimistic delete */

      setPantryItems(prev =>
        prev.filter(i => i.id !== item.id)
      );

      await deletePantryItem(item.documentId);

      toast.success("Item removed");

    } catch (error) {

      toast.error("Delete failed");

      /* rollback */

      setPantryItems(items);

    } finally {

      setDeletingId(null);

    }
  };

  /* ----------------------------- */
  /* CANCEL EDIT */
  /* ----------------------------- */

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", quantity: "" });
  };

  /* ----------------------------- */
  /* UI */
  /* ----------------------------- */

  return (

    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {pantryItems.map((item) => (

        <div
          key={item.id}
          className="bg-white p-5 border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg transition-all"
        >

          {editingId === item.id ? (

            /* EDIT MODE */

            <div className="space-y-3">

              <input
                autoFocus
                value={editValues.name}
                onChange={(e) =>
                  setEditValues({ ...editValues, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                value={editValues.quantity}
                onChange={(e) =>
                  setEditValues({ ...editValues, quantity: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-2">

                <Button
                  onClick={() => handleSave(item)}
                  variant="outline"
                >
                  <Check className="w-4 h-4" />
                </Button>

                <Button
                  onClick={cancelEdit}
                  variant="ghost"
                >
                  <X className="w-4 h-4" />
                </Button>

              </div>

            </div>

          ) : (

            /* VIEW MODE */

            <div>

              <div className="flex items-start justify-between mb-3">

                <div className="flex-1">

                  <h3 className="font-semibold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-stone-500">
                    {item.quantity}
                  </p>

                </div>

                <div className="flex gap-1">

                  <Button
                    onClick={() => startEdit(item)}
                    variant="ghost"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    variant="ghost"
                  >

                    {deletingId === item.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }

                  </Button>

                </div>

              </div>

              <div className="text-xs text-stone-400">
                Added {new Date(item.createdAt).toLocaleDateString()}
              </div>

            </div>

          )}

        </div>

      ))}

    </div>

  );
}
