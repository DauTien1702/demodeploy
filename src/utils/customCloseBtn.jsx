import { MdClose } from "react-icons/md";

const CustomCloseButton = ({ closeToast }) => (
  <button
    onClick={closeToast}
    className="flex items-center justify-center w-8 h-8 ml-15 rounded-full hover:bg-red-100"
    style={{ color: "red" }}
  >
    <MdClose size={20} />
  </button>
);

export default CustomCloseButton;
