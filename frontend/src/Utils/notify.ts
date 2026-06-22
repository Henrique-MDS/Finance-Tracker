import toast from "react-hot-toast";

export const notify = {
    success: (msg: string) => {
        toast.dismiss();
        toast.success(msg, { duration: 1500, position: "top-center" });
    },
    error: (msg: string) => {
        toast.dismiss();
        toast.error(msg, { duration: 1500, position: "top-center" });
    }
}