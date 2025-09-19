import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Pencil, Plus, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { addProduct, allProducts, editProduct, deleteProduct } from "@/api/api"
import Loading from "@/components/shared/Loading"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { AdminProductType, ProductType } from "@/types"
import { toast } from "sonner"

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const tagsRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const stockRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState("")

  const [editForm, setEditForm] = useState<ProductType | null>(null)


  const fetchData = async () => {
    try {
      const response = await allProducts()
      if (response.status === 200) {
        setProducts(response.data)
        console.log(response.data)
      }
    } catch {
      console.error("Error Fetching Data !")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const newproduct: AdminProductType = {
      name: nameRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      category,
      tags: tagsRef.current?.value || "",
      price: Number(priceRef.current?.value) || 0,
      stock: Number(stockRef.current?.value) || 0,
      image: imageRef.current?.value || "",
    }

    try {
      const response = await addProduct(newproduct)
      if (response.status === 200) {
        toast.success("Product Added !")
        fetchData()
        setAddOpen(false)
      }
    } catch {
      toast.error("Error While adding product !")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm) return
    try {
      const response = await editProduct(editForm, editForm.id)
      if (response.status === 200) {
        toast.success("Product Updated !")
        fetchData()
        setEditOpen(false)
      }
    } catch {
      toast.error("Error While updating product !")
    }
  }
  const handleDelete = async () => {
    if (!selectedProduct) return
    try {
      const response = await deleteProduct(selectedProduct.id)
      if (response.status === 200) {
        toast.success("Product Deleted !")
        fetchData()
        setDeleteOpen(false)
      }
    } catch {
      toast.error("Error While deleting product !")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="p-4 flex justify-center items-center w-full flex-col gap-4">
      <div className="w-full flex flex-row">
        <div className="w-1/2 flex justify-start items-center">
          <h2 className="font-bold">Products</h2>
        </div>
        <div className="w-1/2 flex justify-end items-center">
          <Button
            variant="outline"
            className="border-2 border-green-500 text-green-500"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="h-8 w-8 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center">No Products Available !!</div>
      ) : (
        <Table className="w-full bg-gray-50 p-4 rounded-md">
          <TableHeader className="bg-gray-300">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-full h-6 w-6"
                  />
                </TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.tags}</TableCell>
                <TableCell className="flex flex-row gap-2 px-2 justify-end">
                  <Button
                    className="border-2 border-blue-600 cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      setEditForm(product)
                      setEditOpen(true)
                    }}
                  >
                    <Pencil className="h-8 w-8 text-blue-600" />
                  </Button>
                  <Button
                    className="border-2 border-red-600 cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      setSelectedProduct(product)
                      setDeleteOpen(true)
                    }}
                  >
                    <Trash className="h-8 w-8 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={addOpen} onOpenChange={setAddOpen}>
        <AlertDialogContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Add Product</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid gap-3">
              <Label>Name</Label>
              <Input ref={nameRef} placeholder="Product Name" />
              <Label>Image URL</Label>
              <Input ref={imageRef} placeholder="https://..." />
              <Label>Description</Label>
              <Input ref={descriptionRef} placeholder="Description" />
              <Label>Category</Label>
              <Select onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="ELECTRONICS">ELECTRONICS</SelectItem>
                    <SelectItem value="FURNITURE">FURNITURE</SelectItem>
                    <SelectItem value="HOME">HOME</SelectItem>
                    <SelectItem value="FASHION">FASHION</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label>Price</Label>
              <Input ref={priceRef} type="number" />
              <Label>Stock</Label>
              <Input ref={stockRef} type="number" />
              <Label>Tags</Label>
              <Input ref={tagsRef} placeholder="tags" />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="submit">Save</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent>
          <form onSubmit={handleEdit} className="space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Product</AlertDialogTitle>
            </AlertDialogHeader>
            {editForm && (
              <div className="grid gap-3">
                <Label>Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <Label>Image URL</Label>
                <Input
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.value })
                  }
                />
                <Label>Description</Label>
                <Input
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
                <Label>Category</Label>
                <Input
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                />
                <Label>Price</Label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: Number(e.target.value) })
                  }
                />
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: Number(e.target.value) })
                  }
                />
                <Label>Tags</Label>
                <Input
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tags: e.target.value })
                  }
                />
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="submit">Save</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete{" "}
              <span className="font-bold">{selectedProduct?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
export default AdminProducts;