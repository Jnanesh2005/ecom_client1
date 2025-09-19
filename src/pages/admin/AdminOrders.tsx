import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShoppingBag } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrdersType } from "@/types"
import { allOrders } from "@/api/api"

const AdminOrders = () => {

  const [editOpen, setEditOpen] = useState(false)
  const [orders, setOrders] = useState<OrdersType[] | undefined>([])

  useEffect(() => {
    const fetchOrders = async(): Promise<void> => {
      try{
        const result = await allOrders()
        console.log(result.data)
        setOrders(result.data)
      }catch(err){
        if (err instanceof Error){
          console.log("Error fetching user details")
        }else{
          console.log("Unkown error has occured while fetching user details")
        }
      }
    }

    fetchOrders()
    console.log(orders)
  },[])


  return (
    <div className="p-4 flex justify-center items-center w-full flex-col gap-4">
      <div className="w-full flex flex-row">
        <div className="w-1/2 flex justify-start items-center">
          <h2 className="font-bold ">Orders</h2>
        </div>

      </div>
      <Table className="w-full bg-gray-50 p-4 rounded-md">
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Item Summary</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders && orders.map(o => (
            <TableRow>
            <TableCell className="font-medium">{o.userId}</TableCell>
            <TableCell >{o.items && o.items.map(i => 
              <p>{i.productId}</p>
            )}</TableCell>
            <TableCell>{o.items.reduce((total, i) => total + i.price, 0)}</TableCell>
            <TableCell>{o.status}</TableCell>
            <TableCell>{o.createdAt}</TableCell>
            <TableCell>{o.userId}</TableCell>
            <TableCell className="text-right">
              <Button className="border-2 border-cyan-600 cursor-pointer" variant='outline' onClick={() => { setEditOpen(true) }}>
                <ShoppingBag className="h-8 w-8 text-cyan-600" />
              </Button>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={editOpen}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Status</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Order Status</SelectLabel>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="grid gap-3">
                <p>Address </p>
                <p className="font-semibold">1/22</p>
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
    </div>
  )
}

export default AdminOrders