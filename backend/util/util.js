import fs from "fs/promises";
import path from "path";

export async function deleteFolder(folderPath) {
  try {
    // Đọc tất cả file/thư mục trong folder
    const files = await fs.readdir(folderPath);

    // Xóa từng file/thư mục con (đệ quy nếu cần)
    for (const file of files) {
      const curPath = path.join(folderPath, file);
      const stat = await fs.lstat(curPath);

      if (stat.isDirectory()) {
        await deleteFolder(curPath); // đệ quy xóa thư mục con
      } else {
        await fs.unlink(curPath); // xóa file
      }
    }
    // Xóa chính folder sau khi xóa hết bên trong
    await fs.rmdir(folderPath);
  } catch (error) {
    console.error("Failed to delete folder:", error);
    throw error;
  }
}

export async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw error;
  }
}
