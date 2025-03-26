// utils.js

export const validateEmail = (email, allowedDomain) => {
    if (!email.endsWith(allowedDomain)) {
      return `Email phải có đuôi ${allowedDomain}`;
    }
    return null;
  };
  
  export const validatePhone = (phone, phoneRegex) => {
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại không hợp lệ!";
    }
    return null;
  };
  
  export const validateStatusChange = (currentStatus, newStatus, statusRules) => {
    if(currentStatus === newStatus){
      return null
    }
    if (!statusRules[currentStatus].includes(newStatus)) {
      return `Không thể chuyển trạng thái từ "${currentStatus}" sang "${newStatus}"`;
    }
    return null;
  };
  
  export const validateIdentityDocument = (idNumber) => {
    if (!idNumber) {
      return "Số giấy tờ không được để trống.";
    }
    if (!/^\d{9,12}$/.test(idNumber)) {
      return "Số giấy tờ phải có 9-12 chữ số.";
    }
    return null;
  };
  