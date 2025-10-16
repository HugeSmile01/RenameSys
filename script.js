// Global variables
let uploadedFile = null;

// Check if SweetAlert is available
const hasSwal = typeof Swal !== 'undefined';

// Fallback alert function
function showAlert(options) {
    if (hasSwal) {
        Swal.fire(options);
    } else {
        // Fallback to standard alert
        if (options.icon === 'error') {
            alert('Error: ' + (options.text || options.title));
        } else if (options.icon === 'success') {
            alert(options.text || options.title);
        } else if (options.icon === 'info') {
            alert(options.text || options.title);
        }
    }
}

// DOM Elements
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const lessonNumber = document.getElementById('lessonNumber');
const groupNumber = document.getElementById('groupNumber');
const topicName = document.getElementById('topicName');
const submitBtn = document.getElementById('submitBtn');
const previewSection = document.getElementById('previewSection');
const previewName = document.getElementById('previewName');

// File upload handler
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        uploadedFile = file;
        fileName.textContent = `Selected: ${file.name}`;
        fileName.classList.remove('hidden');
        
        showAlert({
            icon: 'success',
            title: 'File Uploaded!',
            text: `${file.name} has been selected successfully.`,
            timer: 2000,
            showConfirmButton: false
        });

        updatePreview();
    }
});

// Drag and drop functionality
const dropZone = document.querySelector('label[for="fileInput"]').parentElement;

dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropZone.classList.add('border-indigo-500', 'bg-indigo-50');
});

dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-500', 'bg-indigo-50');
});

dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-500', 'bg-indigo-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }
});

// Update preview as user types
lessonNumber.addEventListener('input', updatePreview);
groupNumber.addEventListener('input', updatePreview);
topicName.addEventListener('input', updatePreview);

function updatePreview() {
    if (!uploadedFile) return;

    const lesson = lessonNumber.value;
    const group = groupNumber.value;
    const topic = topicName.value.trim();

    if (lesson && group) {
        const extension = getFileExtension(uploadedFile.name);
        let newName = `L${lesson}_G${group}`;
        
        if (topic) {
            // Replace spaces with hyphens and remove special characters except hyphens
            const cleanTopic = topic.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            newName += `_${cleanTopic}`;
        }
        
        newName += extension;
        
        previewName.textContent = newName;
        previewSection.classList.remove('hidden');
    } else {
        previewSection.classList.add('hidden');
    }
}

function getFileExtension(filename) {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) return '';
    return filename.substring(lastDot);
}

// Submit button handler
submitBtn.addEventListener('click', function() {
    // Validation
    if (!uploadedFile) {
        showAlert({
            icon: 'error',
            title: 'No File Selected',
            text: 'Please upload a file first!',
            confirmButtonColor: '#4F46E5'
        });
        return;
    }

    if (!lessonNumber.value) {
        showAlert({
            icon: 'error',
            title: 'Missing Lesson Number',
            text: 'Please enter a lesson number!',
            confirmButtonColor: '#4F46E5'
        });
        lessonNumber.focus();
        return;
    }

    if (!groupNumber.value) {
        showAlert({
            icon: 'error',
            title: 'Missing Group Number',
            text: 'Please enter a group number!',
            confirmButtonColor: '#4F46E5'
        });
        groupNumber.focus();
        return;
    }

    // Generate new filename
    const lesson = lessonNumber.value;
    const group = groupNumber.value;
    const topic = topicName.value.trim();
    const extension = getFileExtension(uploadedFile.name);
    
    let newFileName = `L${lesson}_G${group}`;
    
    if (topic) {
        const cleanTopic = topic.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        newFileName += `_${cleanTopic}`;
    }
    
    newFileName += extension;

    // Show success message with download button
    if (hasSwal) {
        Swal.fire({
            icon: 'success',
            title: 'File Renamed Successfully!',
            html: `
                <p class="text-gray-700 mb-4">New filename: <strong>${newFileName}</strong></p>
                <button id="downloadBtn" class="bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Download File
                </button>
            `,
            showConfirmButton: false,
            allowOutsideClick: true,
            didOpen: () => {
                const downloadBtn = document.getElementById('downloadBtn');
                downloadBtn.addEventListener('click', function() {
                    downloadRenamedFile(uploadedFile, newFileName);
                });
            }
        });
    } else {
        // Fallback: immediate download
        const confirmed = confirm(`File will be renamed to: ${newFileName}\n\nClick OK to download.`);
        if (confirmed) {
            downloadRenamedFile(uploadedFile, newFileName);
        }
    }
});

function downloadRenamedFile(file, newFileName) {
    // Create a new file with the new name
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (hasSwal) {
        Swal.fire({
            icon: 'success',
            title: 'Downloaded!',
            text: `${newFileName} has been downloaded successfully.`,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            // Reset form
            resetForm();
        });
    } else {
        alert(`Downloaded: ${newFileName}`);
        resetForm();
    }
}

function resetForm() {
    uploadedFile = null;
    fileInput.value = '';
    fileName.classList.add('hidden');
    lessonNumber.value = '';
    groupNumber.value = '';
    topicName.value = '';
    previewSection.classList.add('hidden');
}

// Show welcome message on load
window.addEventListener('load', function() {
    showAlert({
        icon: 'info',
        title: 'Welcome to RenameSys!',
        text: 'Upload a file and rename it according to the BSIT format.',
        confirmButtonColor: '#4F46E5',
        confirmButtonText: 'Get Started'
    });
});
