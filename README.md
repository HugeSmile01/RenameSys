# RenameSys

A file renaming system designed for BSIT 1st year students to easily rename their files with a standardized naming convention.

## Features

- 📁 **File Upload**: Upload any file type
- 🔢 **Structured Naming**: Automatically format filenames with Lesson number, Group number, and optional Topic name
- 👀 **Live Preview**: See the renamed filename before downloading
- ⬇️ **Instant Download**: Download the renamed file with one click
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS
- ✨ **Interactive Alerts**: User-friendly notifications with SweetAlert2

## Filename Format

The system generates filenames in the following format:

```
L{lesson}_G{group}_{topic}.{extension}
```

**Examples:**
- With topic: `L8_G1_Environmental-Ethics.pdf`
- Without topic: `L5_G2.docx`

## Usage

1. Open `index.html` in your web browser
2. Click to upload or drag and drop a file
3. Enter the **Lesson Number** (required)
4. Enter the **Group Number** (required)
5. Optionally enter a **Topic Name**
6. Click **Submit & Generate Download**
7. Download your renamed file

## Technologies Used

- HTML5
- Tailwind CSS (for styling)
- JavaScript (ES6+)
- SweetAlert2 (for alerts and notifications)

## Developer

**John Rish Ladica**  
BSIT - 1A

## License

This project is created for educational purposes.