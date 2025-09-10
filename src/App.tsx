import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";

const addJobButtonClassName =
  "self-end bg-gray-200 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300";

const AddJobButtonChildren = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-plus-icon lucide-plus text-gray-400"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
      Add job
    </>
  );
};

function App() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="max-w-[800px] mx-auto p-4 flex flex-col gap-4">
      {isDesktop && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className={addJobButtonClassName}>
              <AddJobButtonChildren />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            Some form...
          </DialogContent>
        </Dialog>
      )}
      {!isDesktop && (
        <Drawer>
          <DrawerTrigger className={addJobButtonClassName}>
            <AddJobButtonChildren />
          </DrawerTrigger>
          <DrawerContent>
            <form>
              <div className="flex flex-col gap-2 px-4">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  className="border border-gray-300 rounded-md p-2"
                />
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  className="border border-gray-300 rounded-md p-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <DrawerFooter className="flex gap-2">
                <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300">
                  Submit
                </button>
                <DrawerClose className="border border-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300">
                  Cancel
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      )}
      <div className="border border-gray-300 rounded-md flex justify-between items-start gap-2">
        <div className="flex flex-col gap-2  py-4 pl-4 grow">
          <div className="flex gap-4 items-center">
            <div className="text-lg font-semibold text-gray-900">Acme Inc.</div>
            <div className="text-white bg-green-500 rounded-md px-2">
              Active
            </div>
          </div>
          <div className="text-gray-500 text-sm">01/01/2025</div>
        </div>
        <button className="text-gray-400 p-1.5 rounded-sm hover:bg-gray-100 m-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-pencil-icon lucide-pencil"
          >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
