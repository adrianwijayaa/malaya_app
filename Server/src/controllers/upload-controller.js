exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({
      message: "Image uploaded successfully",
      url: filePath,
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};
