import { Box, Button, Chip, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LanIcon from "@mui/icons-material/Lan";
import PersonIcon from "@mui/icons-material/Person";
import UpdateIcon from "@mui/icons-material/Update";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  InfoRow,
  InputRow,
  InputSelectRow,
} from "../../../../utils/updateForm";

const UpdateUser = ({ open, user, handleClose, refreshUsers }) => {
  const userRole = localStorage.getItem("roles");
  const token = localStorage.getItem("sessionToken");

  //State
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(user);
  const [originalUser, setOriginalUser] = useState(null);

  // Set data from user into selectedUser
  useEffect(() => {
    if (user) {
      setSelectedUser(user);
    }
  }, [user]);

  const handleCloseModal = () => {
    setErrors({});
    handleClose();
    setIsEditing(false);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    let newErrors = { ...errors };
    if (name === "phone") {
      const phoneRegex = /^(84|0[3|5|7|8|9])\d{8}$/;
      newErrors.phone = phoneRegex.test(value)
        ? ""
        : "Số điện thoại không hợp lệ!";
    }

    setErrors(newErrors);
  };

  // Handle btn edit
  const handleEditToggle = () => {
    //First time click btn: If click in update go into edit mode (save data berfore changes)
    if (!isEditing) {
      setOriginalUser({ ...selectedUser });
    } else {
      // Second time click btn:
      handleSaveUpdate();
    }

    setIsEditing(!isEditing);
  };

  // Handle logic update user
  const handleSaveUpdate = async (e) => {
    const currentUserId = selectedUser.id;
    const updates = {};

    // Check user data change or not
    if (selectedUser.fullName !== originalUser.fullName) {
      updates.fullName = selectedUser.fullName;
    }
    if (selectedUser.roles !== originalUser.roles) {
      updates.roles = selectedUser.roles;
    }
    if (selectedUser.phone !== originalUser.phone) {
      updates.phone = selectedUser.phone;
    }
    if (selectedUser.status !== originalUser.status) {
      updates.status = selectedUser.status;
    }

    if (Object.values(errors).some((error) => error)) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    if (Object.keys(updates).length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/user/${currentUserId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fullName: selectedUser.fullName,
              roles: selectedUser.roles,
              phone: selectedUser.phone,
              status: selectedUser.status,
            }),
          }
        );

        if (response.ok) {
          toast.success("Cập nhật thành công");
          handleCloseModal();
          setSelectedUser(user);
          refreshUsers?.();
        }
      } catch (err) {
        toast.error("Lỗi cập nhật người dùng: ", err);
      }
    } else {
      toast.info("Không có gì thay đổi");
      handleCloseModal;
    }
  };

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(to right, #42a5f5, #1976d2)",
            color: "white",
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            <ContactMailIcon className="mr-1" />
            Thông tin người dùng
          </Typography>

          <Button
            variant="text"
            sx={{
              color: "#f44336",
              border: "2px solid #f44336",
              borderColor: "#f44336",
              backgroundColor: "#ffffff",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#f44336",
                color: "#ffffff",
                borderColor: "#f44336",
              },
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
            Đóng
          </Button>
        </Box>

        {/* Body */}
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "70vh",
          }}
        >
          {selectedUser && (
            <Box component="dl" sx={{ p: 2 }}>
              {isEditing ? (
                <>
                  {/* Edit mode */}
                  <InputRow
                    icon={<PersonIcon sx={{ mr: 1 }} />}
                    label="Tên"
                    name="fullName"
                    value={selectedUser.fullName}
                    onChange={handleChange}
                  />
                  <InputRow
                    icon={<PersonIcon sx={{ mr: 1 }} />}
                    label="Số điện thoại"
                    name="phone"
                    value={selectedUser.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    helperText={errors.phone}
                  />
                  <InputSelectRow
                    icon={<LanIcon sx={{ mr: 1 }} />}
                    label="Quyền hạn"
                    name="roles"
                    value={selectedUser.roles}
                    onChange={handleChange}
                    options={[
                      { label: "ADMIN", value: "ADMIN" },
                      { label: "STAFF", value: "STAFF" },
                      { label: "CUSTOMER", value: "CUSTOMER" },
                    ]}
                  />
                  <InputSelectRow
                    icon={<VerifiedUserIcon sx={{ mr: 1 }} />}
                    label="Trạng thái"
                    name="status"
                    value={selectedUser.status}
                    onChange={(e) =>
                      setSelectedUser((prevUser) => ({
                        ...prevUser,
                        status: e.target.value === "true",
                      }))
                    }
                    options={[
                      { label: "Đang hoạt động", value: "true" },
                      { label: "Ngưng hoạt động", value: "false" },
                    ]}
                  />
                </>
              ) : (
                <>
                  {/* Display mode */}
                  <InfoRow
                    icon={<PersonIcon sx={{ mr: 1 }} />}
                    label="Tên"
                    value={selectedUser.fullName}
                  />
                  <InfoRow
                    icon={<EmailIcon sx={{ mr: 1 }} />}
                    label="Email"
                    value={selectedUser.username}
                  />
                  <InfoRow
                    icon={<PhoneIcon sx={{ mr: 1 }} />}
                    label="Số điện thoại"
                    value={selectedUser.phone}
                  />
                  <InfoRow
                    icon={<LanIcon sx={{ mr: 1 }} />}
                    label="Quyền hạn"
                    value={selectedUser.roles}
                  />
                  <InfoRow
                    icon={<VerifiedUserIcon sx={{ mr: 1 }} />}
                    label="Trạng thái"
                    value={
                      <Chip
                        label={
                          selectedUser.status
                            ? "Đang hoạt động"
                            : "Ngưng hoạt động"
                        }
                        sx={{
                          backgroundColor: selectedUser.status
                            ? "rgba(76, 175, 80, 0.1)"
                            : "rgba(244, 67, 54, 0.1)",
                          color: selectedUser.status ? "#4caf50" : "#f44336",
                          border: `1px solid ${
                            selectedUser.status ? "#4caf50" : "#f44336"
                          }`,
                          fontWeight: 500,
                          minWidth: "90px",
                          textAlign: "center",
                        }}
                        size="small"
                        variant="outlined"
                      />
                    }
                  />
                </>
              )}

              {/* Button */}
              {userRole === "ADMIN" ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      border: "2px solid #1976d2",
                      color: "#1976d2",
                      backgroundColor: "#ffffff",
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#1976d2",
                        color: "#ffffff",
                      },
                    }}
                    onClick={handleEditToggle}
                  >
                    <UpdateIcon />
                    {isEditing ? "Lưu" : "Cập Nhật"}
                  </Button>
                </Box>
              ) : (
                <></>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateUser;
