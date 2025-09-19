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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { allUsers } from "@/api/api"
import type { UserType } from "@/types"

const AdminUsers = () => {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [users, setUsers] = useState<UserType[] | undefined>()

  useEffect(() => {
    const fetchUsers = async(): Promise<void> => {
      try{
        const result = await allUsers()
        console.log(result.data)
        setUsers(result.data)
      }catch(err){
        if (err instanceof Error){
          console.log("Error fetching user details")
        }else{
          console.log("Unkown error has occured while fetching user details")
        }
      }
    }

    fetchUsers()
    console.log(users)
  },[])


  return (
    <div className="p-4 flex justify-center items-center w-full flex-col gap-4">
      <div className="w-full flex flex-row">
        <div className="w-1/2 flex justify-start items-center">
          <h2 className="font-bold ">Users</h2>
        </div>
        <div className="w-1/2 flex justify-end items-center">
          <Button variant='outline' className="border-2 border-green-500 text-green-500" onClick={() => { setAddOpen(true) }}><Plus className="h-8 w-8 mr-2" /> Add User</Button>
        </div>
      </div>
      <Table className="w-full bg-gray-50 p-4 rounded-md">
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Zip</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((u) => (
            <TableRow>
            <TableCell className="font-medium">{u.id}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{u.name}</TableCell>
            <TableCell>{u.street}</TableCell>
            <TableCell>{u.city}</TableCell>
            <TableCell>{u.zip}</TableCell>
            <TableCell className="flex flex-row gap-2 px-2 justify-end">
              <Button className="border-2 border-blue-600 cursor-pointer" variant='outline' onClick={() => { setEditOpen(true) }}>
                <Pencil className="h-8 w-8 text-blue-600" />
              </Button>
              <Button className="border-2 border-red-600 cursor-pointer" variant='outline' onClick={() => { setDeleteOpen(true) }}>
                <Trash className="h-8 w-8 text-red-600" />
              </Button>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={addOpen}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="User" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" placeholder="user@gmail.com" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" placeholder="*******" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="street">Street</Label>
                <Input id="street" name="street"/>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city"/>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="zip">Zip</Label>
                <Input id="zip" name="zip"/>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => { setAddOpen(false) }}>Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>


      <Dialog open={editOpen}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue="User" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" defaultValue="user@gmail.com"/>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" defaultValue="*******" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="street">Street</Label>
                <Input id="street" name="street"/>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city"/>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="zip">Zip</Label>
                <Input id="zip" name="zip"/>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => { setEditOpen(false) }}>Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>


      <AlertDialog open={deleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeleteOpen(false) }}>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminUsers